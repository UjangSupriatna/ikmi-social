import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { createVerificationToken, sendResendVerificationEmail } from '@/lib/email'

const resendSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = resendSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Email tidak valid',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { email } = validationResult.data

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
        isVerified: true,
      },
    })

    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        message: 'Jika email terdaftar dan belum diverifikasi, email verifikasi akan dikirim.',
      })
    }

    // If already verified, don't send
    if (user.isVerified) {
      return NextResponse.json({
        message: 'Email ini sudah terverifikasi. Silakan login.',
        alreadyVerified: true,
      })
    }

    // Create new verification token
    const { token } = await createVerificationToken(user.id)
    
    // Send verification email
    const result = await sendResendVerificationEmail(user.email, user.name, token)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Gagal mengirim email verifikasi' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Email verifikasi berhasil dikirim. Silakan cek inbox atau folder spam Anda.',
      emailSent: true,
      // In development, include the verification URL for testing
      ...(process.env.NODE_ENV !== 'production' && {
        verificationUrl: result.verificationUrl,
      }),
    })
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
