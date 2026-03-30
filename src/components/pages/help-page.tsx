'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { HelpCircle, MessageCircle, Users, Settings, Bell, Shield, ChevronDown, ChevronRight } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqItems: FAQItem[] = [
  // Akun
  {
    category: 'Akun',
    question: 'Bagaimana cara mengubah foto profil?',
    answer: 'Buka profil Anda, klik tombol "Edit Profil", lalu pilih tab "Foto". Anda dapat mengupload foto baru yang akan otomatis dikompresi untuk ukuran optimal.',
  },
  {
    category: 'Akun',
    question: 'Bagaimana cara mengubah password?',
    answer: 'Saat ini perubahan password dapat dilakukan melalui menu pengaturan atau menghubungi admin untuk bantuan lebih lanjut.',
  },
  // Postingan
  {
    category: 'Postingan',
    question: 'Bagaimana cara membuat postingan?',
    answer: 'Di halaman Beranda, gunakan form "Buat Post" di bagian atas. Anda dapat menambahkan teks, gambar, dan lokasi pada postingan Anda.',
  },
  {
    category: 'Postingan',
    question: 'Bagaimana cara menghapus postingan?',
    answer: 'Pada postingan Anda, klik ikon menu (titik tiga) di pojok kanan atas, lalu pilih "Hapus". Postingan akan dihapus permanen.',
  },
  // Teman
  {
    category: 'Teman',
    question: 'Bagaimana cara menambah teman?',
    answer: 'Gunakan fitur pencarian untuk menemukan pengguna lain, atau lihat rekomendasi teman di halaman Teman. Klik tombol "Tambah Teman" untuk mengirim permintaan.',
  },
  {
    category: 'Teman',
    question: 'Bagaimana cara menerima permintaan pertemanan?',
    answer: 'Buka halaman Teman, lalu pilih tab "Permintaan". Anda akan melihat daftar permintaan pertemanan yang dapat diterima atau ditolak.',
  },
  // Privasi
  {
    category: 'Privasi',
    question: 'Siapa yang dapat melihat postingan saya?',
    answer: 'Anda dapat mengatur visibilitas postingan menjadi Publik (semua orang), Teman (hanya teman), atau Privat (hanya Anda). Pengaturan ini tersedia saat membuat postingan.',
  },
  {
    category: 'Privasi',
    question: 'Bagaimana cara memblokir pengguna?',
    answer: 'Saat ini fitur blokir sedang dalam pengembangan. Jika ada masalah dengan pengguna lain, silakan hubungi admin.',
  },
  // Grup
  {
    category: 'Grup',
    question: 'Bagaimana cara membuat grup?',
    answer: 'Buka halaman Grup, klik tombol "Buat Grup". Isi nama, deskripsi, dan pengaturan privasi grup. Anda akan otomatis menjadi admin grup tersebut.',
  },
  {
    category: 'Grup',
    question: 'Bagaimana cara bergabung ke grup?',
    answer: 'Cari grup yang ingin Anda ikuti, lalu klik tombol "Gabung". Untuk grup privat, permintaan Anda harus disetujui oleh admin grup terlebih dahulu.',
  },
  // Event
  {
    category: 'Event',
    question: 'Bagaimana cara membuat event?',
    answer: 'Buka halaman Event, klik "Buat Event". Isi detail event seperti nama, tanggal, lokasi, dan deskripsi. Event akan terlihat oleh semua pengguna.',
  },
  {
    category: 'Event',
    question: 'Bagaimana cara mendaftar event?',
    answer: 'Buka detail event, lalu klik tombol "Hadir" atau "Tertarik". Status kehadiran Anda akan tercatat dan terlihat oleh pembuat event.',
  },
]

export function HelpPage() {
  const [expandedItems, setExpandedItems] = React.useState<string[]>([])
  const categories = [...new Set(faqItems.map(item => item.category))]

  const toggleItem = (question: string) => {
    setExpandedItems(prev => 
      prev.includes(question) 
        ? prev.filter(q => q !== question)
        : [...prev, question]
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-4 space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <HelpCircle className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Pusat Bantuan</CardTitle>
              <p className="text-xs text-muted-foreground">FAQ dan panduan penggunaan</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Temukan jawaban untuk pertanyaan umum tentang penggunaan IKMI SOCIAL. 
            Jika tidak menemukan jawaban, Anda dapat menghubungi admin melalui fitur AI Assistant.
          </p>
        </CardContent>
      </Card>

      {/* FAQ */}
      {categories.map((category) => (
        <Card key={category}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {category === 'Akun' && <Settings className="size-4" />}
              {category === 'Postingan' && <MessageCircle className="size-4" />}
              {category === 'Teman' && <Users className="size-4" />}
              {category === 'Privasi' && <Shield className="size-4" />}
              {category === 'Grup' && <Users className="size-4" />}
              {category === 'Event' && <Bell className="size-4" />}
              {category}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {faqItems.filter(item => item.category === category).map((item, index) => (
              <div key={item.question}>
                <button
                  onClick={() => toggleItem(item.question)}
                  className={cn(
                    "w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-muted/50 transition-colors",
                    index > 0 && "border-t"
                  )}
                >
                  {expandedItems.includes(item.question) ? (
                    <ChevronDown className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                  ) : (
                    <ChevronRight className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                  )}
                  <span className="text-sm font-medium">{item.question}</span>
                </button>
                {expandedItems.includes(item.question) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pb-3 pl-11"
                  >
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Contact */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Masih Butuh Bantuan?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Gunakan fitur <strong className="text-foreground">AI Assistant</strong> untuk bertanya langsung 
            atau hubungi developer melalui email di <a href="mailto:admin@itsacademics.com" className="text-primary hover:underline">admin@itsacademics.com</a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
