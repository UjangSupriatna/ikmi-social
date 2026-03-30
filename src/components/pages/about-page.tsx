'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Info, Mail, Phone, MapPin, Globe, Users, GraduationCap } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-4 space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Info className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Tentang IKMI SOCIAL</CardTitle>
              <p className="text-xs text-muted-foreground">Platform sosial kampus IKMI</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">IKMI SOCIAL</strong> adalah platform media sosial yang dikembangkan oleh 
            <strong className="text-foreground"> komunitas independen</strong> untuk sivitas akademika Sekolah Tinggi Manajemen 
            Informatika dan Komputer (STMIK) IKMI. Platform ini bukan merupakan produk resmi dari pihak kampus, melainkan 
            inisiatif dari komunitas untuk memfasilitasi komunikasi, kolaborasi, dan interaksi antara mahasiswa, dosen, dan staff.
          </p>

          <Separator />

          {/* Disclaimer */}
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs text-primary">
              <strong>Catatan:</strong> Platform ini dikembangkan secara mandiri oleh komunitas dan tidak ada hubungan afiliasi 
              resmi dengan pihak kampus IKMI. Untuk informasi resmi kampus, silakan kunjungi website resmi IKMI.
            </p>
          </div>

          {/* Visi Misi */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Visi & Misi</h3>
            <div className="grid gap-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <h4 className="font-medium text-sm mb-1">Visi</h4>
                <p className="text-xs text-muted-foreground">
                  Menjadi platform komunikasi digital terdepan yang menghubungkan seluruh civitas akademika IKMI 
                  dalam ekosistem pembelajaran dan kolaborasi yang inovatif.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <h4 className="font-medium text-sm mb-1">Misi</h4>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Memfasilitasi komunikasi efektif antar mahasiswa, dosen, dan staff</li>
                  <li>Menyediakan ruang berbagi informasi akademik dan non-akademik</li>
                  <li>Mendukung aktivitas kemahasiswaan dan organisasi kampus</li>
                  <li>Membangun komunitas digital yang positif dan produktif</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fitur */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Fitur Utama</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { icon: Users, label: 'Profil & Teman', desc: 'Kelola profil dan terhubung dengan teman' },
              { icon: GraduationCap, label: 'Grup & Komunitas', desc: 'Bergabung dalam grup studi dan organisasi' },
              { icon: Globe, label: 'Berbagi Post', desc: 'Bagikan momen dan informasi' },
              { icon: Mail, label: 'Pesan Langsung', desc: 'Chat privat dengan sesama civitas' },
              { icon: MapPin, label: 'Event Kampus', desc: 'Lihat dan buat event akademik' },
              { icon: Info, label: 'AI Assistant', desc: 'Asisten cerdas untuk membantu' },
            ].map((fitur, index) => (
              <motion.div
                key={fitur.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <fitur.icon className="size-5 text-primary mb-2" />
                <h4 className="font-medium text-xs sm:text-sm">{fitur.label}</h4>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{fitur.desc}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Kontak Developer */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Kontak Developer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="size-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Alamat</p>
              <p className="text-xs text-muted-foreground">Bandung, Indonesia</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="size-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Telepon</p>
              <p className="text-xs text-muted-foreground">+6282240066466</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="size-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <a href="mailto:admin@itsacademics.com" className="text-xs text-primary hover:underline">admin@itsacademics.com</a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Globe className="size-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Website</p>
              <div className="flex flex-col gap-1">
                <a href="https://itsacademics.com" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">itsacademics.com</a>
                <a href="https://e-projects.cloud" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">e-projects.cloud</a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
