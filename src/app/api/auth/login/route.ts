import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { validateCredentialsWithVerification, generateToken, setAuthCookie } from '@/lib/auth'
import { createVerificationToken, sendVerificationEmail } from '@/lib/email'

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { identifier, password } = validationResult.data

    // Validate credentials with verification check
    const result = await validateCredentialsWithVerification(identifier, password)

    if (!result.user) {
      return NextResponse.json(
        { error: 'Email/username atau password salah' },
        { status: 401 }
      )
    }

    // Check if user is verified
    if (!result.isVerified) {
      // Create new verification token and send email
      const { token } = await createVerificationToken(result.user.id)
      await sendVerificationEmail(result.email!, result.name!, token)
      
      return NextResponse.json(
        { 
          error: 'Email belum diverifikasi',
          needsVerification: true,
          email: result.email,
          message: 'Akun Anda belum diverifikasi. Kami telah mengirim ulang email verifikasi ke alamat email Anda.'
        },
        { status: 403 }
      )
    }

    // Generate JWT token
    const token = await generateToken({
      userId: result.user.id,
      email: result.user.email,
      username: result.user.username,
    })

    // Set auth cookie
    await setAuthCookie(token)

    return NextResponse.json({
      message: 'Login successful',
      user: result.user,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
