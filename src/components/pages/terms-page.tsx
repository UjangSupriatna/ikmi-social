'use client'

import * as React from 'react'
import { FileText } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-4 space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Ketentuan Penggunaan</CardTitle>
              <p className="text-xs text-muted-foreground">Terakhir diperbarui: Januari 2025</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Ketentuan Penggunaan ini mengatur penggunaan platform IKMI SOCIAL. Dengan mengakses dan menggunakan 
            platform ini, Anda menyetujui untuk terikat oleh ketentuan-ketentuan berikut.
          </p>
        </CardContent>
      </Card>

      {/* Sections */}
      <Card>
        <CardContent className="space-y-4 pt-4">
          {/* 1. Penerimaan Ketentuan */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">1. Penerimaan Ketentuan</h3>
            <div className="text-sm text-muted-foreground space-y-2 pl-4">
              <p>Dengan mendaftar dan menggunakan IKMI SOCIAL, Anda menyatakan bahwa:</p>
              <ul className="space-y-1 pl-4">
                <li>• Anda adalah bagian dari komunitas pengguna platform ini</li>
                <li>• Anda berusia minimal 17 tahun atau memiliki izin dari orang tua/wali</li>
                <li>• Anda akan mematuhi semua ketentuan yang berlaku</li>
              </ul>
            </div>
          </div>

          <Separator />

          {/* 2. Pendaftaran Akun */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">2. Pendaftaran dan Keamanan Akun</h3>
            <div className="text-sm text-muted-foreground space-y-2 pl-4">
              <ul className="space-y-1 pl-4">
                <li>• Anda bertanggung jawab untuk menjaga kerahasiaan password akun Anda</li>
                <li>• Anda tidak boleh membagikan akun Anda kepada orang lain</li>
                <li>• Anda harus segera melaporkan jika mencurigai akun Anda disalahgunakan</li>
                <li>• Setiap akun harus menggunakan identitas yang sebenarnya</li>
              </ul>
            </div>
          </div>

          <Separator />

          {/* 3. Konten Pengguna */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">3. Konten Pengguna</h3>
            <div className="text-sm text-muted-foreground space-y-2 pl-4">
              <p><strong className="text-foreground">Tanggung Jawab Konten:</strong> Anda bertanggung jawab penuh atas konten yang Anda posting, termasuk kebenaran dan legalitasnya.</p>
              <p><strong className="text-foreground">Hak Konten:</strong> Anda mempertahankan hak kepemilikan atas konten Anda. Dengan memposting, Anda memberikan izin kepada IKMI SOCIAL untuk menampilkan konten tersebut di platform.</p>
              <p><strong className="text-foreground">Konten yang Dilarang:</strong></p>
              <ul className="space-y-1 pl-4">
                <li>• Konten yang melanggar hukum Indonesia</li>
                <li>• Konten yang mengandung ujaran kebencian atau diskriminasi</li>
                <li>• Konten pornografi atau tidak senonoh</li>
                <li>• Konten yang melanggar hak cipta pihak lain</li>
                <li>• Konten yang menyesatkan atau disinformasi</li>
                <li>• Spam atau konten komersial tanpa izin</li>
              </ul>
            </div>
          </div>

          <Separator />

          {/* 4. Perilaku Pengguna */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">4. Perilaku yang Diperbolehkan dan Dilarang</h3>
            <div className="text-sm text-muted-foreground space-y-2 pl-4">
              <p><strong className="text-foreground">Anda dilarang:</strong></p>
              <ul className="space-y-1 pl-4">
                <li>• Mengirim spam atau pesan yang tidak diinginkan</li>
                <li>• Melecehkan, mengintimidasi, atau mengancam pengguna lain</li>
                <li>• Mencoba mengakses akun orang lain tanpa izin</li>
                <li>• Menggunakan bot atau skrip otomatis tanpa izin</li>
                <li>• Menyebarkan malware atau kode berbahaya</li>
                <li>• Menyamar sebagai orang lain atau entitas</li>
              </ul>
            </div>
          </div>

          <Separator />

          {/* 5. Hak Kekayaan Intelektual */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">5. Hak Kekayaan Intelektual</h3>
            <div className="text-sm text-muted-foreground space-y-2 pl-4">
              <p>Seluruh konten, fitur, dan fungsionalitas IKMI SOCIAL adalah milik developer dan dilindungi oleh hukum hak cipta Indonesia. Anda tidak boleh:</p>
              <ul className="space-y-1 pl-4">
                <li>• Menyalin, memodifikasi, atau mendistribusikan platform tanpa izin</li>
                <li>• Menggunakan merek dagang atau logo tanpa izin</li>
                <li>• Melakukan reverse engineering terhadap platform</li>
              </ul>
            </div>
          </div>

          <Separator />

          {/* 6. Penghentian Akun */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">6. Penghentian dan Penangguhan Akun</h3>
            <div className="text-sm text-muted-foreground space-y-2 pl-4">
              <p>Kami berhak untuk menangguhkan atau menghapus akun Anda jika:</p>
              <ul className="space-y-1 pl-4">
                <li>• Anda melanggar Ketentuan Penggunaan ini</li>
                <li>• Anda tidak aktif dalam jangka waktu yang lama</li>
                <li>• Anda terlibat dalam aktivitas ilegal atau berbahaya</li>
                <li>• Atas permintaan Anda sendiri</li>
              </ul>
            </div>
          </div>

          <Separator />

          {/* 7. Batasan Tanggung Jawab */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">7. Batasan Tanggung Jawab</h3>
            <div className="text-sm text-muted-foreground space-y-2 pl-4">
              <p>IKMI SOCIAL disediakan "sebagaimana adanya". Kami tidak menjamin bahwa:</p>
              <ul className="space-y-1 pl-4">
                <li>• Platform akan selalu tersedia tanpa gangguan</li>
                <li>• Platform bebas dari kesalahan atau bug</li>
                <li>• Konten pengguna akan selalu akurat atau dapat diandalkan</li>
              </ul>
              <p className="mt-2">Kami tidak bertanggung jawab atas kerugian yang timbul dari penggunaan platform ini.</p>
            </div>
          </div>

          <Separator />

          {/* 8. Perubahan Ketentuan */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">8. Perubahan Ketentuan</h3>
            <div className="text-sm text-muted-foreground pl-4">
              <p>Kami dapat mengubah Ketentuan Penggunaan ini sewaktu-waktu. Perubahan akan berlaku efektif setelah dipublikasikan di platform. Penggunaan berkelanjutan Anda dianggap sebagai penerimaan terhadap perubahan tersebut.</p>
            </div>
          </div>

          <Separator />

          {/* 9. Hukum yang Berlaku */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">9. Hukum yang Berlaku</h3>
            <div className="text-sm text-muted-foreground pl-4">
              <p>Ketentuan Penggunaan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Sengketa yang timbul akan diselesaikan melalui pengadilan yang berwenang di Indonesia.</p>
            </div>
          </div>

          <Separator />

          {/* 10. Kontak */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">10. Hubungi Kami</h3>
            <p className="text-sm text-muted-foreground pl-4">
              Untuk pertanyaan tentang Ketentuan Penggunaan ini, silakan hubungi developer di{' '}
              <a href="mailto:admin@itsacademics.com" className="text-primary hover:underline">admin@itsacademics.com</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
