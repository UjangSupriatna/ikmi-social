import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// AI Chat endpoint using DeepSeek API from database
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', response: 'Anda harus login terlebih dahulu.' }, { status: 401 })
    }

    const body = await request.json()
    const { message, history } = body
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required', response: 'Pesan tidak boleh kosong.' }, { status: 400 })
    }

    // Get API credentials from database
    const apiConfig = await db.api.findUnique({ where: { id: 1 } })
    if (!apiConfig || !apiConfig.baseurl || !apiConfig.key_api) {
      return NextResponse.json({ 
        error: 'API not configured', 
        response: 'API AI belum dikonfigurasi. Silakan hubungi administrator.' 
      }, { status: 500 })
    }

    // Get comprehensive data from database for context
    let dbContext = ''
    try {
      // Get users (public profile only)
      const users = await db.user.findMany({
        take: 15,
        select: { 
          id: true,
          name: true, 
          username: true, 
          headline: true, 
          bio: true,
          website: true,
          skills: true,
          gender: true,
          createdAt: true
        }
      })
      if (users.length > 0) {
        dbContext += `\n\n## Pengguna Terdaftar (${users.length} orang):\n`
        dbContext += users.map(u => {
          let info = `- ${u.name} (@${u.username})`
          if (u.headline) info += ` | ${u.headline}`
          if (u.skills) info += ` | Skills: ${u.skills.slice(0, 50)}`
          return info
        }).join('\n')
      }

      // Get events
      const events = await db.event.findMany({
        take: 10,
        select: { 
          id: true,
          title: true, 
          description: true,
          startDate: true, 
          endDate: true,
          location: true,
          locationType: true,
          onlineUrl: true,
          category: true,
          isFree: true,
          price: true,
          status: true,
          createdBy: { select: { name: true } }
        }
      })
      if (events.length > 0) {
        dbContext += `\n\n## Event (${events.length}):\n`
        dbContext += events.map(e => {
          const date = e.startDate ? new Date(e.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'TBA'
          const price = e.isFree ? 'Gratis' : e.price || 'Berbayar'
          const loc = e.locationType === 'online' ? `Online: ${e.onlineUrl || 'Link akan diinformasikan'}` : e.location || 'TBA'
          return `- **${e.title}** (${e.status})\n  Tanggal: ${date}\n  Lokasi: ${loc}\n  Kategori: ${e.category}\n  Harga: ${price}\n  Penyelenggara: ${e.createdBy.name}`
        }).join('\n')
      }

      // Get groups
      const groups = await db.group.findMany({
        take: 10,
        select: { 
          id: true,
          name: true, 
          description: true,
          privacy: true,
          createdAt: true,
          createdBy: { select: { name: true } },
          _count: { select: { members: true, posts: true } }
        }
      })
      if (groups.length > 0) {
        dbContext += `\n\n## Grup (${groups.length}):\n`
        dbContext += groups.map(g => {
          const privacy = g.privacy === 'private' ? 'Private' : 'Publik'
          return `- **${g.name}** (${privacy}) - ${g._count.members} anggota, ${g._count.posts} post\n  Dibuat oleh: ${g.createdBy.name}${g.description ? `\n  Deskripsi: ${g.description.slice(0, 100)}...` : ''}`
        }).join('\n')
      }

      // Get public posts
      const posts = await db.post.findMany({
        where: { visibility: 'public', groupId: null },
        take: 5,
        select: {
          content: true,
          location: true,
          createdAt: true,
          author: { select: { name: true, username: true } }
        }
      })
      if (posts.length > 0) {
        dbContext += `\n\n## Postingan Terbaru:\n`
        dbContext += posts.map(p => `- ${p.author.name}: "${p.content.slice(0, 80)}..."`).join('\n')
      }

      // Count statistics
      const [userCount, postCount, groupCount, eventCount] = await Promise.all([
        db.user.count(),
        db.post.count(),
        db.group.count(),
        db.event.count()
      ])
      dbContext += `\n\n## Statistik IKMI SOCIAL:\n`
      dbContext += `Total Pengguna: ${userCount}\nTotal Postingan: ${postCount}\nTotal Grup: ${groupCount}\nTotal Event: ${eventCount}`

    } catch (e) {
      console.log('Could not fetch database context:', e)
    }

    const systemPrompt = `Anda adalah AI Assistant IKMI SOCIAL, asisten untuk platform IKMI SOCIAL.

## Identitas IKMI SOCIAL:
IKMI SOCIAL adalah platform media sosial kampus untuk STMIK IKMI.
Dibuat oleh: Ujang Supriatna dari Bandung

## Tugas Anda:
Anda HANYA menjawab pertanyaan seputar IKMI SOCIAL dan data yang ada di database.

## Data SENSITIF yang TIDAK BOLEH dibagikan:
- Email user lain
- Password siapapun
- Tanggal lahir user lain
- Nomor telepon user lain
- Alamat user lain

Jika ditanya data sensitif, tolak dengan: "Maaf, saya tidak bisa memberikan informasi pribadi user lain."

## Aturan Respons:
- Jawab dengan SINGKAT dan PADAT
- Gunakan teks biasa saja
- JANGAN gunakan tabel, kode, atau gambar
- Jika ditanya di luar IKMI SOCIAL, jawab: "Maaf, saya hanya bisa menjawab seputar IKMI SOCIAL."

## Data IKMI SOCIAL:${dbContext}

## Informasi Kampus:
- Nama: STMIK IKMI
- Lokasi: Cikarang, Bekasi, Jawa Barat  
- Website: ikmi.ac.id

Jawab singkat dan to the point dalam Bahasa Indonesia.`

    // Build messages with history (last 5 messages)
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt }
    ]
    
    // Add history (last 5 messages)
    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-5)
      recentHistory.forEach((msg: ChatMessage) => {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role,
            content: msg.content
          })
        }
      })
    }
    
    // Add current message
    messages.push({ role: 'user', content: message })

    // Call DeepSeek API (OpenAI-compatible)
    const response = await fetch(`${apiConfig.baseurl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiConfig.key_api}`
      },
      body: JSON.stringify({
        model: 'vertex_ai/deepseek-ai/deepseek-v3.2-maas',
        messages: messages,
        max_tokens: 2000,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('DeepSeek API Error:', response.status, errorText)
      return NextResponse.json({ 
        error: 'API Error', 
        response: 'Maaf, layanan AI sedang mengalami gangguan. Silakan coba lagi nanti.' 
      }, { status: 500 })
    }

    const data = await response.json()
    const responseContent = data.choices?.[0]?.message?.content || 'Maaf, saya tidak dapat memproses permintaan Anda.'

    return NextResponse.json({ 
      response: responseContent 
    })

  } catch (error) {
    console.error('AI Chat Error:', error)
    return NextResponse.json({ 
      error: 'Failed to process message',
      response: 'Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi.' 
    }, { status: 500 })
  }
}
