import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, hashPassword, getCurrentUser } from '@/lib/auth'

// PUT /api/users/me/password - Change password
export async function PUT(request: NextRequest) {
  try {
    // Get current user from auth
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Password lama dan baru harus diisi' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password baru minimal 6 karakter' }, { status: 400 })
    }

    // Get current user with password
    const userWithPassword = await db.user.findUnique({
      where: { id: user.id },
      select: { id: true, password: true },
    })

    if (!userWithPassword) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, userWithPassword.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Password saat ini salah' }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword)

    // Update password
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ message: 'Password berhasil diubah' })
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json({ error: 'Gagal mengubah password' }, { status: 500 })
  }
}
