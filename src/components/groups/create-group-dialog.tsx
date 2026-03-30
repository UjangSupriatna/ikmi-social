'use client'

import * as React from 'react'
import { Loader2, X, Globe, Lock, Upload } from 'lucide-react'

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { getImageUrl } from '@/lib/utils'

interface CreateGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGroupCreated?: (group: unknown) => void
}

export function CreateGroupDialog({
  open,
  onOpenChange,
  onGroupCreated,
}: CreateGroupDialogProps) {
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [privacy, setPrivacy] = React.useState<'public' | 'private'>('public')
  const [coverImage, setCoverImage] = React.useState<string | null>(null)
  const [avatar, setAvatar] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState<'avatar' | 'cover' | null>(null)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const { toast } = useToast()

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setName('')
      setDescription('')
      setPrivacy('public')
      setCoverImage(null)
      setAvatar(null)
    }
  }, [open])

  // Upload image to server with compression and progress
  const uploadImage = async (file: File, type: 'avatar' | 'cover'): Promise<string | null> => {
    try {
      // Simulate progress
      let currentProgress = 0
      const progressInterval = setInterval(() => {
        currentProgress = Math.min(currentProgress + 15, 90)
        setUploadProgress(currentProgress)
      }, 100)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'groups')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error('Upload gagal')
      }

      const data = await response.json()
      setUploadProgress(100)
      
      return data.path
    } catch (error) {
      console.error('Upload error:', error)
      return null
    }
  }

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'cover' | 'avatar'
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'File tidak valid',
        description: 'Hanya file gambar yang diperbolehkan',
        variant: 'destructive',
      })
      return
    }

    setIsUploading(type)

    // Show preview immediately using local URL
    const previewUrl = URL.createObjectURL(file)
    if (type === 'cover') {
      setCoverImage(previewUrl)
    } else {
      setAvatar(previewUrl)
    }

    try {
      // Upload to server with compression
      const uploadedUrl = await uploadImage(file, type)

      if (uploadedUrl) {
        // Update with server URL
        if (type === 'cover') {
          setCoverImage(uploadedUrl)
        } else {
          setAvatar(uploadedUrl)
        }

        toast({
          title: 'Gambar berhasil diupload',
          description: 'Gambar telah dikompresi dan disimpan',
        })
      } else {
        throw new Error('Upload gagal')
      }
    } catch (error) {
      console.error('Image error:', error)
      toast({
        title: 'Error',
        description: 'Gagal mengupload gambar. Coba lagi.',
        variant: 'destructive',
      })
      if (type === 'cover') {
        setCoverImage(null)
      } else {
        setAvatar(null)
      }
    } finally {
      setIsUploading(null)
      setUploadProgress(0)
    }
  }

  const removeImage = (type: 'cover' | 'avatar') => {
    if (type === 'cover') {
      setCoverImage(null)
    } else {
      setAvatar(null)
    }
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Nama group wajib diisi',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          privacy,
          coverImage,
          avatar,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Gagal membuat group')
      }

      const group = await response.json()
      toast({
        title: 'Group dibuat',
        description: `"${group.name}" berhasil dibuat`,
      })

      setName('')
      setDescription('')
      setPrivacy('public')
      setCoverImage(null)
      setAvatar(null)
      
      onGroupCreated?.(group)
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating group:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Gagal membuat group',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Buat Group Baru</DialogTitle>
          <DialogDescription>
            Buat group untuk terhubung dengan orang lain yang memiliki minat sama.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Group Avatar & Name */}
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              {avatar ? (
                <div className="relative size-20 rounded-full overflow-hidden border-2 border-primary/20">
                  <img
                    src={avatar.startsWith('blob:') ? avatar : (getImageUrl(avatar) || avatar)}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage('avatar')}
                    className="absolute -top-1 -right-1 size-6 rounded-full bg-destructive text-white flex items-center justify-center shadow-md hover:bg-destructive/90"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ) : (
                <label className="size-20 rounded-full border-2 border-dashed border-muted-foreground/50 bg-muted/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-all">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'avatar')}
                    disabled={isUploading === 'avatar'}
                  />
                  {isUploading === 'avatar' ? (
                    <div className="flex flex-col items-center w-16">
                      <Loader2 className="size-5 text-muted-foreground animate-spin mb-1" />
                      <Progress value={uploadProgress} className="h-1 w-12" />
                      <span className="text-[10px] text-muted-foreground mt-1">{uploadProgress}%</span>
                    </div>
                  ) : (
                    <Upload className="size-5 text-muted-foreground" />
                  )}
                </label>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Label htmlFor="name" className="text-sm font-medium">Nama Group *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama group"
                maxLength={100}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {name.length}/100 karakter
              </p>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            📷 Foto profil: rekomendasi 200x200px
          </p>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Cover Image</Label>
            {coverImage ? (
              <div className="relative h-32 rounded-lg overflow-hidden border border-border">
                <img
                  src={coverImage.startsWith('blob:') ? coverImage : (getImageUrl(coverImage) || coverImage)}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage('cover')}
                  className="absolute top-2 right-2 size-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <label className="h-32 rounded-lg border-2 border-dashed border-muted-foreground/50 bg-muted/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-all">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'cover')}
                  disabled={isUploading === 'cover'}
                />
                {isUploading === 'cover' ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="size-8 text-muted-foreground animate-spin" />
                    <div className="w-32 mt-2">
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                    <span className="text-sm text-muted-foreground mt-1">{uploadProgress}%</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="size-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Klik untuk upload cover
                    </span>
                  </div>
                )}
              </label>
            )}
            <p className="text-xs text-muted-foreground">
              📷 Cover: rekomendasi 800x300px
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Deskripsi</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Group ini tentang apa?"
              maxLength={500}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/500 karakter
            </p>
          </div>

          {/* Privacy */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Privasi</Label>
            <RadioGroup
              value={privacy}
              onValueChange={(value) => setPrivacy(value as 'public' | 'private')}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="public" id="public" />
                <label
                  htmlFor="public"
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <Globe className="size-4 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Publik</p>
                    <p className="text-xs text-muted-foreground">
                      Semua orang bisa join
                    </p>
                  </div>
                </label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="private" id="private" />
                <label
                  htmlFor="private"
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <Lock className="size-4 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Private</p>
                    <p className="text-xs text-muted-foreground">
                      Hanya undangan
                    </p>
                  </div>
                </label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !name.trim()}
            className="gap-2 min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Membuat...
              </>
            ) : (
              'Buat Group'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
