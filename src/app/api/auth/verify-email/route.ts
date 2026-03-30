import { NextRequest, NextResponse } from 'next/server'
import { verifyEmailToken } from '@/lib/email'
import { generateToken, setAuthCookie } from '@/lib/auth'
import { db } from '@/lib/db'

// Use production URL for redirects
const APP_URL =
  process.env.APP_URL ||
  process.env.NEXTAUTH_URL ||
  'https://ikmisocial.web.id'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(
        new URL('/?verification=error&message=Token tidak ditemukan', APP_URL)
      )
    }

    // Verify the token
    const result = await verifyEmailToken(token)

    if (!result.success) {
      return NextResponse.redirect(
        new URL(`/?verification=error&message=${encodeURIComponent(result.error || 'Verifikasi gagal')}`, APP_URL)
      )
    }

    // Get user data for auto-login
    const user = await db.user.findUnique({
      where: { id: result.userId },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
      },
    })

    if (user) {
      // Auto-login the user after verification
      const jwtToken = await generateToken({
        userId: user.id,
        email: user.email,
        username: user.username,
      })
      await setAuthCookie(jwtToken)
    }

    // Redirect to success page
    return NextResponse.redirect(
      new URL(`/?verification=success&name=${encodeURIComponent(user?.name || 'User')}`, APP_URL)
    )
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.redirect(
      new URL('/?verification=error&message=Terjadi kesalahan saat verifikasi', APP_URL)
    )
  }
}
