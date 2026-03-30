'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Loader2, X, Plus, Camera, Image as ImageIcon, Eye, EyeOff, Lock } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, getImageUrl } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface UserProfile {
  id: string
  name: string
  username: string
  avatar: string | null
  coverPhoto: string | null
  bio: string | null
  headline: string | null
  skills: string | null
  phone: string | null
  address: string | null
  website: string | null
}

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: UserProfile | null
  onSave: (data: Partial<UserProfile>) => Promise<void>
  isLoading?: boolean
}

// Upload image to server with compression
async function uploadImageToServer(file: File, type: 'avatar' | 'cover'): Promise<string | null> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'profiles')

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Upload gagal')
    }

    const data = await response.json()
    return data.path
  } catch (error) {
    console.error('Upload error:', error)
    return null
  }
}

export function EditProfileDialog({
  open,
  onOpenChange,
  profile,
  onSave,
  isLoading = false,
}: EditProfileDialogProps) {
  const { toast } = useToast()
  const [formData, setFormData] = React.useState({
    name: '',
    bio: '',
    headline: '',
    phone: '',
    address: '',
    website: '',
    skills: [] as string[],
    avatar: null as string | null,
    coverPhoto: null as string | null,
  })
  const [newSkill, setNewSkill] = React.useState('')
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false)
  const [isUploadingCover, setIsUploadingCover] = React.useState(false)

  // Password change state
  const [passwordData, setPasswordData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [isChangingPassword, setIsChangingPassword] = React.useState(false)

  // Initialize form data when profile changes
  React.useEffect(() => {
    if (profile) {
      let skills: string[] = []
      try {
        skills = profile.skills ? JSON.parse(profile.skills) : []
      } catch {
        skills = []
      }

      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        headline: profile.headline || '',
        phone: profile.phone || '',
        address: profile.address || '',
        website: profile.website || '',
        skills,
        avatar: profile.avatar,
        coverPhoto: profile.coverPhoto,
      })
    }
  }, [profile])

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      return
    }

    setIsUploadingAvatar(true)
    try {
      const uploadedUrl = await uploadImageToServer(file, 'avatar')
      if (uploadedUrl) {
        setFormData(prev => ({ ...prev, avatar: uploadedUrl }))
      }
    } catch (error) {
      console.error('Error processing image:', error)
    } finally {
      setIsUploadingAvatar(false)
    }
    e.target.value = ''
  }

  // Handle cover photo upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      return
    }

    setIsUploadingCover(true)
    try {
      const uploadedUrl = await uploadImageToServer(file, 'cover')
      if (uploadedUrl) {
        setFormData(prev => ({ ...prev, coverPhoto: uploadedUrl }))
      }
    } catch (error) {
      console.error('Error processing image:', error)
    } finally {
      setIsUploadingCover(false)
    }
    e.target.value = ''
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if user wants to change password
    const hasPasswordFields = passwordData.currentPassword || passwordData.newPassword || passwordData.confirmPassword

    if (hasPasswordFields) {
      // Validate password fields
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        toast({
          title: 'Error',
          description: 'Semua kolom password harus diisi untuk mengubah password',
          variant: 'destructive',
        })
        return
      }

      if (passwordData.newPassword.length < 6) {
        toast({
          title: 'Error',
          description: 'Password baru minimal 6 karakter',
          variant: 'destructive',
        })
        return
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast({
          title: 'Error',
          description: 'Password baru dan konfirmasi tidak cocok',
          variant: 'destructive',
        })
        return
      }

      // Change password first
      setIsChangingPassword(true)
      try {
        const response = await fetch('/api/users/me/password', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          toast({
            title: 'Gagal',
            description: data.error || 'Gagal mengubah password',
            variant: 'destructive',
          })
          setIsChangingPassword(false)
          return
        }

        // Password changed, reset fields
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } catch {
        toast({
          title: 'Error',
          description: 'Terjadi kesalahan. Silakan coba lagi.',
          variant: 'destructive',
        })
        setIsChangingPassword(false)
        return
      } finally {
        setIsChangingPassword(false)
      }
    }

    // Save profile data
    await onSave({
      name: formData.name,
      bio: formData.bio,
      headline: formData.headline,
      phone: formData.phone,
      address: formData.address,
      website: formData.website,
      skills: JSON.stringify(formData.skills),
      avatar: formData.avatar,
      coverPhoto: formData.coverPhoto,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profil</DialogTitle>
          <DialogDescription>
            Perbarui informasi profil Anda. Klik simpan setelah selesai.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="w-full grid grid-cols-5">
              <TabsTrigger value="basic" className="text-xs sm:text-sm">
                Info
              </TabsTrigger>
              <TabsTrigger value="photos" className="text-xs sm:text-sm">
                Foto
              </TabsTrigger>
              <TabsTrigger value="contact" className="text-xs sm:text-sm">
                Kontak
              </TabsTrigger>
              <TabsTrigger value="skills" className="text-xs sm:text-sm">
                Keahlian
              </TabsTrigger>
              <TabsTrigger value="security" className="text-xs sm:text-sm">
                Password
              </TabsTrigger>
            </TabsList>

            {/* Photos Tab */}
            <TabsContent value="photos" className="space-y-4 mt-4">
              {/* Avatar Upload */}
              <div className="space-y-3">
                <Label>Foto Profil</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="size-20 border-2 border-border">
                    <AvatarImage src={getImageUrl(formData.avatar) || undefined} />
                    <AvatarFallback className="text-lg bg-primary/10 text-primary">
                      {formData.name ? getInitials(formData.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <label htmlFor="avatar-upload">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-2 cursor-pointer"
                        disabled={isUploadingAvatar}
                        asChild
                      >
                        <span>
                          {isUploadingAvatar ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Camera className="size-4" />
                          )}
                          Ganti Foto
                        </span>
                      </Button>
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG. Maks 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cover Photo Upload */}
              <div className="space-y-3">
                <Label>Foto Sampul</Label>
                <div className="relative">
                  <div className="h-32 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 overflow-hidden border border-border">
                    {getImageUrl(formData.coverPhoto) && (
                      <img
                        src={getImageUrl(formData.coverPhoto)!}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <label htmlFor="cover-upload">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-2 right-2 gap-2 cursor-pointer"
                      disabled={isUploadingCover}
                      asChild
                    >
                      <span>
                        {isUploadingCover ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <ImageIcon className="size-4" />
                        )}
                        Ganti Sampul
                      </span>
                    </Button>
                  </label>
                  <input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverUpload}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Rekomendasi: 1500x500px. JPG, PNG. Maks 5MB.
                </p>
              </div>
            </TabsContent>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Nama Anda"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="headline">Judul</Label>
                <Input
                  id="headline"
                  value={formData.headline}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, headline: e.target.value }))
                  }
                  placeholder="contoh: Pengembang Software di Perusahaan"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="Ceritakan tentang diri Anda..."
                  rows={4}
                />
              </div>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telepon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+62 812 3456 7890"
                  type="tel"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Lokasi</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, address: e.target.value }))
                  }
                  placeholder="Kota, Negara"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, website: e.target.value }))
                  }
                  placeholder="https://websiteanda.com"
                  type="url"
                />
              </div>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Tambah Keahlian</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="contoh: JavaScript, React, Node.js"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddSkill()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={handleAddSkill}>
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Keahlian Anda</Label>
                <div className="flex flex-wrap gap-2 min-h-[60px] p-3 rounded-lg border border-border bg-muted/30">
                  {formData.skills.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Belum ada keahlian yang ditambahkan</p>
                  ) : (
                    formData.skills.map((skill) => (
                      <motion.div
                        key={skill}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                      >
                        <Badge
                          variant="secondary"
                          className="gap-1 pr-1 bg-primary/10 text-primary"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-1 rounded-full p-0.5 hover:bg-primary/20"
                          >
                            <X className="size-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="size-5 text-muted-foreground" />
                  <h3 className="font-medium">Ubah Password</h3>
                </div>

                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Password Saat Ini</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Masukkan password saat ini"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Password Baru</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Masukkan password baru"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Minimal 6 karakter</p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Ulangi password baru"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Education Dialog
interface Education {
  id?: string
  institution: string
  degree: string
  field: string | null
  startDate: string
  endDate: string | null
  description: string | null
}

interface EducationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  education: Education | null
  onSave: (data: Education) => Promise<void>
  isLoading?: boolean
}

export function EducationDialog({
  open,
  onOpenChange,
  education,
  onSave,
  isLoading = false,
}: EducationDialogProps) {
  const [formData, setFormData] = React.useState<Education>({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    description: '',
  })

  React.useEffect(() => {
    if (education) {
      // Convert date to YYYY-MM format for month input
      const formatDateToMonth = (date: string | Date) => {
        const d = new Date(date)
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      }
      setFormData({
        institution: education.institution || '',
        degree: education.degree || '',
        field: education.field || '',
        startDate: education.startDate ? formatDateToMonth(education.startDate) : '',
        endDate: education.endDate ? formatDateToMonth(education.endDate) : '',
        description: education.description || '',
      })
    } else {
      setFormData({
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        description: '',
      })
    }
  }, [education, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{education?.id ? 'Edit Pendidikan' : 'Tambah Pendidikan'}</DialogTitle>
          <DialogDescription>
            Tambahkan latar belakang pendidikan Anda ke profil.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="institution">Institusi *</Label>
            <Input
              id="institution"
              value={formData.institution}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, institution: e.target.value }))
              }
              placeholder="Nama universitas"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="degree">Gelar *</Label>
            <Input
              id="degree"
              value={formData.degree}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, degree: e.target.value }))
              }
              placeholder="contoh: Sarjana, Magister"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field">Bidang Studi</Label>
            <Input
              id="field"
              value={formData.field || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, field: e.target.value }))
              }
              placeholder="contoh: Ilmu Komputer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Tanggal Mulai *</Label>
              <Input
                id="startDate"
                type="month"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Tanggal Selesai</Label>
              <Input
                id="endDate"
                type="month"
                value={formData.endDate || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Detail tambahan..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
              {education?.id ? 'Perbarui' : 'Tambah'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Experience Dialog
interface Experience {
  id?: string
  company: string
  position: string
  location: string | null
  startDate: string
  endDate: string | null
  current: boolean
  description: string | null
}

interface ExperienceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  experience: Experience | null
  onSave: (data: Experience) => Promise<void>
  isLoading?: boolean
}

export function ExperienceDialog({
  open,
  onOpenChange,
  experience,
  onSave,
  isLoading = false,
}: ExperienceDialogProps) {
  const [formData, setFormData] = React.useState<Experience>({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  })

  React.useEffect(() => {
    if (experience) {
      // Convert date to YYYY-MM format for month input
      const formatDateToMonth = (date: string | Date) => {
        const d = new Date(date)
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      }
      setFormData({
        company: experience.company || '',
        position: experience.position || '',
        location: experience.location || '',
        startDate: experience.startDate ? formatDateToMonth(experience.startDate) : '',
        endDate: experience.endDate ? formatDateToMonth(experience.endDate) : '',
        current: experience.current || false,
        description: experience.description || '',
      })
    } else {
      setFormData({
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      })
    }
  }, [experience, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{experience?.id ? 'Edit Pengalaman' : 'Tambah Pengalaman'}</DialogTitle>
          <DialogDescription>
            Tambahkan pengalaman kerja Anda ke profil.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Perusahaan *</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, company: e.target.value }))
              }
              placeholder="Nama perusahaan"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Posisi *</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, position: e.target.value }))
              }
              placeholder="Judul pekerjaan"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input
              id="location"
              value={formData.location || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="Kota, Negara"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exp-startDate">Tanggal Mulai *</Label>
              <Input
                id="exp-startDate"
                type="month"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-endDate">Tanggal Selesai</Label>
              <Input
                id="exp-endDate"
                type="month"
                value={formData.endDate || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
                disabled={formData.current}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="current"
              checked={formData.current}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, current: checked, endDate: checked ? '' : prev.endDate }))
              }
            />
            <Label htmlFor="current">Saya masih bekerja di sini</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exp-description">Deskripsi</Label>
            <Textarea
              id="exp-description"
              value={formData.description || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Jelaskan tanggung jawab Anda..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
              {experience?.id ? 'Perbarui' : 'Tambah'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Achievement Dialog
interface Achievement {
  id?: string
  title: string
  description: string | null
  date: string | null
  issuer: string | null
}

interface AchievementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  achievement: Achievement | null
  onSave: (data: Achievement) => Promise<void>
  isLoading?: boolean
}

export function AchievementDialog({
  open,
  onOpenChange,
  achievement,
  onSave,
  isLoading = false,
}: AchievementDialogProps) {
  const [formData, setFormData] = React.useState<Achievement>({
    title: '',
    description: '',
    date: '',
    issuer: '',
  })

  React.useEffect(() => {
    if (achievement) {
      setFormData({
        title: achievement.title || '',
        description: achievement.description || '',
        date: achievement.date ? new Date(achievement.date).toISOString().split('T')[0] : '',
        issuer: achievement.issuer || '',
      })
    } else {
      setFormData({
        title: '',
        description: '',
        date: '',
        issuer: '',
      })
    }
  }, [achievement, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{achievement?.id ? 'Edit Pencapaian' : 'Tambah Pencapaian'}</DialogTitle>
          <DialogDescription>
            Tambahkan pencapaian dan sertifikasi Anda.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ach-title">Judul *</Label>
            <Input
              id="ach-title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Judul pencapaian"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ach-issuer">Organisasi Pemberi</Label>
            <Input
              id="ach-issuer"
              value={formData.issuer || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, issuer: e.target.value }))
              }
              placeholder="Nama organisasi"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ach-date">Tanggal</Label>
            <Input
              id="ach-date"
              type="date"
              value={formData.date || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ach-description">Deskripsi</Label>
            <Textarea
              id="ach-description"
              value={formData.description || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Jelaskan pencapaian Anda..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
              {achievement?.id ? 'Perbarui' : 'Tambah'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Portfolio Dialog
interface Portfolio {
  id?: string
  title: string
  description: string | null
  link: string | null
  images: string[]
  technologies: string[]
}

interface PortfolioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  portfolio: Portfolio | null
  onSave: (data: Portfolio) => Promise<void>
  isLoading?: boolean
}

export function PortfolioDialog({
  open,
  onOpenChange,
  portfolio,
  onSave,
  isLoading = false,
}: PortfolioDialogProps) {
  const [formData, setFormData] = React.useState<Portfolio>({
    title: '',
    description: '',
    link: '',
    images: [],
    technologies: [],
  })
  const [newTech, setNewTech] = React.useState('')
  const [newImage, setNewImage] = React.useState('')

  React.useEffect(() => {
    if (portfolio) {
      setFormData({
        title: portfolio.title || '',
        description: portfolio.description || '',
        link: portfolio.link || '',
        images: portfolio.images || [],
        technologies: portfolio.technologies || [],
      })
    } else {
      setFormData({
        title: '',
        description: '',
        link: '',
        images: [],
        technologies: [],
      })
    }
    setNewTech('')
    setNewImage('')
  }, [portfolio, open])

  const handleAddTech = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()],
      }))
      setNewTech('')
    }
  }

  const handleRemoveTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }))
  }

  const handleAddImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage.trim()],
      }))
      setNewImage('')
    }
  }

  const handleRemoveImage = (image: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((i) => i !== image),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{portfolio?.id ? 'Edit Proyek' : 'Tambah Proyek'}</DialogTitle>
          <DialogDescription>
            Tambahkan proyek portfolio Anda untuk memamerkan karya.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="port-title">Judul *</Label>
            <Input
              id="port-title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Judul proyek"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="port-description">Deskripsi</Label>
            <Textarea
              id="port-description"
              value={formData.description || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Jelaskan proyek Anda..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="port-link">Link Proyek</Label>
            <Input
              id="port-link"
              value={formData.link || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, link: e.target.value }))
              }
              placeholder="https://... atau link Google Drive"
              type="url"
            />
            <p className="text-xs text-muted-foreground">Bisa gunakan link website atau Google Drive</p>
          </div>

          <div className="space-y-2">
            <Label>Teknologi</Label>
            <div className="flex gap-2">
              <Input
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="Tambah teknologi"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTech()
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddTech}>
                <Plus className="size-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {formData.technologies.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="gap-1 bg-primary/10 text-primary"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Gambar (URL)</Label>
            <div className="flex gap-2">
              <Input
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="Paste link Google Drive atau URL gambar"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddImage()
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddImage}>
                <Plus className="size-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              📷 Rekomendasi: 800x600px
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {formData.images.map((image) => (
                <Badge key={image} variant="outline" className="gap-1">
                  Gambar
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(image)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
              {portfolio?.id ? 'Perbarui' : 'Tambah'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
