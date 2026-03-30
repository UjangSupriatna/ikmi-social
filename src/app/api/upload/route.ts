import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// ==================== PATH RESOLUTION ====================
// Membaca UPLOAD_BASE_DIR dari env, fallback ke deteksi otomatis

function getUploadDir(): string {
  // 1. Env variable (prioritas tertinggi)
  if (process.env.UPLOAD_BASE_DIR) return process.env.UPLOAD_BASE_DIR
  if (process.env.UPLOAD_PATH) return process.env.UPLOAD_PATH

  // 2. Deteksi standalone mode (production)
  const cwd = process.cwd()
  if (cwd.includes('.next/standalone')) {
    const parts = cwd.split(path.sep)
    const idx = parts.lastIndexOf('.next')
    if (idx > 0) {
      return parts.slice(0, idx).join(path.sep) + '/public/uploads'
    }
  }

  // 3. Fallback default
  return path.join(cwd, 'public', 'uploads')
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_FILE_SIZE = (parseInt(process.env.MAX_FILE_SIZE || '10', 10) || 10) * 1024 * 1024

// ==================== POST /api/upload ====================

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    let formData: FormData
    try {
      formData = await request.formData()
    } catch {
      return NextResponse.json({ success: false, error: 'Failed to parse form data' }, { status: 400 })
    }

    const file = formData.get('file') as File | null
    const type = formData.get('type') as string || 'posts'

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ success: false, error: `Tipe file "${file.type}" tidak didukung. Gunakan JPEG, PNG, GIF, atau WebP.` }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: `File terlalu besar. Maksimum ${MAX_FILE_SIZE / 1024 / 1024}MB.` }, { status: 400 })
    }

    // Coba beberapa direktori, gunakan yang pertama berhasil
    const primaryDir = getUploadDir()
    let uploadDir = ''
    let dirReady = false

    for (const dir of [primaryDir, '/tmp/uploads']) {
      try {
        await mkdir(dir, { recursive: true })
        // Test write permission
        const testFile = path.join(dir, '.write-test-' + Date.now())
        await writeFile(testFile, 'test')
        const { unlink } = await import('fs/promises')
        await unlink(testFile)
        uploadDir = dir
        dirReady = true
        console.log('[UPLOAD] Menggunakan direktori:', uploadDir)
        break
      } catch (e) {
        console.error('[UPLOAD] Gagal akses direktori:', dir, e instanceof Error ? e.message : e)
      }
    }

    if (!dirReady) {
      console.error('[UPLOAD] Semua direktori gagal. Primary:', primaryDir)
      return NextResponse.json({
        success: false,
        error: 'Gagal membuat folder upload. Pastikan folder ada dan bisa ditulis.'
      }, { status: 500 })
    }

    // Buat subfolder berdasarkan type (posts, avatars, covers, dll)
    const typeDir = path.join(uploadDir, type)
    await mkdir(typeDir, { recursive: true })

    // Generate nama file unik
    const extension = file.name.split('.').pop() || 'jpg'
    const fileName = `${Date.now()}-${uuidv4().slice(0, 8)}.${extension}`

    // Simpan file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = path.join(typeDir, fileName)

    try {
      await writeFile(filePath, buffer)
      console.log('[UPLOAD] File disimpan:', filePath)
    } catch (writeError) {
      console.error('[UPLOAD] Gagal menulis file:', writeError)
      return NextResponse.json({ success: false, error: 'Gagal menyimpan file' }, { status: 500 })
    }

    // Return path untuk serve
    const publicPath = `/api/serve/${type}/${fileName}`

    return NextResponse.json({
      success: true,
      path: publicPath,
      fileName,
    })
  } catch (error) {
    console.error('[UPLOAD] Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Upload gagal'
    }, { status: 500 })
  }
}
