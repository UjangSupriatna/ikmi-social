'use client'

import * as React from 'react'
import { Shield } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-4 space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Kebijakan Privasi</CardTitle>
              <p className="text-xs text-muted-foreground">Terakhir diperbarui: Januari 2025</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Kebijakan Privasi ini menjelaskan bagaimana IKMI SOCIAL mengumpulkan, menggunakan, dan melindungi 
            informasi pribadi Anda saat menggunakan platform ini.
          </p>
        </CardContent>
      </Card>

      {/* Sections */}
      <Card>
        <CardContent className="space-y-4 pt-4">
          {/* 1. Informasi yang Dikumpulkan */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">1. Informasi yang Kami Kumpulkan</h3>
            <div className="text-sm text-muted-foreground space-y-1.5 pl-4">
              <p><strong className="text-foreground">Informasi Akun:</strong> Nama lengkap, username, email, foto profil, dan foto sampul yang Anda berikan saat mendaftar dan mengedit profil.</p>
              <p><strong className="text-foreground">Konten Pengguna:</strong> Postingan, komentar, pesan, gambar, dan konten lain yang Anda bagikan di platform.</p>
              <p><strong className="text-foreground">Informasi Aktivitas:</strong> Log aktivitas seperti interaksi dengan konten, grup yang diikuti, dan event yang diikuti.</p>
            </div>
          </div>

          <Separator />

          {/* 2. Penggunaan Informasi */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">2. Penggunaan Informasi</h3>
            <div className="text-sm text-muted-foreground space-y-2 pl-4">
              <p>Informasi yang dikumpulkan digunakan untuk:</p>
              <ul className="space-y-1 pl-4">
                <li>• Menyediakan dan mengembangkan layanan IKMI SOCIAL</li>
                <li>• Memfasilitasi interaksi antar pengguna</li>
                <li>• Mengirim notifikasi terkait aktivitas akun</li>
                <li>• Meningkatkan keamanan dan mencegah penyalahgunaan</li>
                <li>• Melakukan analisis untuk peningkatan layanan</li>
              </ul>
            </div>
          </div>

          <Separator />

          {/* 3. Berbagi Informasi */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">3. Berbagi Informasi</h3>
            <div className="text-sm text-muted-foreground space-y-2 pl-4">
              <p>Kami tidak menjual data pribadi Anda kepada pihak ketiga. Informasi Anda dapat dibagikan dalam kondisi berikut:</p>
              <ul className="space-y-1.5">
                <li className="flex gap-1.5"><strong className="text-foreground">• Pengguna Lain:</strong> <span>Informasi profil dan konten yang Anda publikasikan dapat dilihat oleh pengguna lain sesuai pengaturan privasi Anda.</span></li>
                <li className="flex gap-1.5"><strong className="text-foreground">• Pihak Berwenang:</strong> <span>Jika diwajibkan oleh hukum atau proses hukum yang sah.</span></li>
                <li className="flex gap-1.5"><strong className="text-foreground">• Keamanan:</strong> <span>Untuk melindungi hak dan keamanan platform serta pengguna.</span></li>
              </ul>
            </div>
          </div>

          <Separator />

          {/* 4. Keamanan Data */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">4. Keamanan Data</h3>
            <div className="text-sm text-muted-foreground space-y-2 pl-4">
              <p>Kami menerapkan langkah-langkah keamanan yang sesuai untuk melindungi informasi Anda, termasuk:</p>
              <ul className="space-y-1 pl-4">
                <li>• Enkripsi password dan data sensitif</li>
                <li>• Akses terbatas ke data pribadi oleh personel yang berwenang</li>
                <li>• Pemantauan sistem untuk mendeteksi aktivitas mencurigakan</li>
                <li>• Pencadangan data secara berkala</li>
              </ul>
            </div>
          </div>

          <Separator />

          {/* 5. Hak Pengguna */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">5. Hak Pengguna</h3>
            <div className="text-sm text-muted-foreground space-y-2 pl-4">
              <p>Anda memiliki hak untuk:</p>
              <ul className="space-y-1 pl-4">
                <li>• Mengakses dan memperbarui informasi profil Anda</li>
                <li>• Mengatur pengaturan privasi konten Anda</li>
                <li>• Menghapus konten yang Anda buat</li>
                <li>• Menonaktifkan atau menghapus akun Anda</li>
                <li>• Mengajukan keluhan terkait penggunaan data</li>
              </ul>
            </div>
          </div>

          <Separator />

          {/* 6. Cookie dan Teknologi Serupa */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">6. Cookie dan Teknologi Serupa</h3>
            <div className="text-sm text-muted-foreground space-y-2 pl-4">
              <p>IKMI SOCIAL menggunakan cookie dan teknologi serupa untuk:</p>
              <ul className="space-y-1 pl-4">
                <li>• Menyimpan preferensi dan sesi login Anda</li>
                <li>• Menganalisis penggunaan platform</li>
                <li>• Meningkatkan pengalaman pengguna</li>
              </ul>
            </div>
          </div>

          <Separator />

          {/* 7. Perubahan Kebijakan */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">7. Perubahan Kebijakan</h3>
            <div className="text-sm text-muted-foreground pl-4">
              <p>Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan signifikan akan diinformasikan melalui notifikasi di platform.</p>
            </div>
          </div>

          <Separator />

          {/* 8. Kontak */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">8. Hubungi Kami</h3>
            <p className="text-sm text-muted-foreground pl-4">
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi developer di{' '}
              <a href="mailto:admin@itsacademics.com" className="text-primary hover:underline">admin@itsacademics.com</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
