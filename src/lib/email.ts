import { randomBytes } from 'crypto'
import nodemailer from 'nodemailer'
import { db } from './db'

// Configuration for email verification
const VERIFICATION_TOKEN_LENGTH = 32
const VERIFICATION_TOKEN_EXPIRY_HOURS = 24

// SMTP Configuration from user's email settings
const SMTP_CONFIG = {
  host: 'mail.ikmisocial.web.id',
  port: 465,
  secure: true, // SSL/TLS
  auth: {
    user: 'noreply@ikmisocial.web.id',
    pass: process.env.SMTP_PASSWORD || '', // Password should be in .env
  },
}

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: SMTP_CONFIG.host,
    port: SMTP_CONFIG.port,
    secure: SMTP_CONFIG.secure,
    auth: {
      user: SMTP_CONFIG.auth.user,
      pass: SMTP_CONFIG.auth.pass,
    },
    tls: {
      rejectUnauthorized: false, // For self-signed certificates
    },
  })
}

export interface VerificationResult {
  success: boolean
  verificationUrl?: string
  token?: string
  error?: string
  messageId?: string
}

/**
 * Generate a secure verification token
 */
export function generateVerificationToken(): string {
  return randomBytes(VERIFICATION_TOKEN_LENGTH).toString('hex')
}

/**
 * Calculate token expiry date
 */
export function getTokenExpiry(): Date {
  const expiry = new Date()
  expiry.setHours(expiry.getHours() + VERIFICATION_TOKEN_EXPIRY_HOURS)
  return expiry
}

/**
 * Create verification token for a user
 */
export async function createVerificationToken(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = generateVerificationToken()
  const expiresAt = getTokenExpiry()

  await db.user.update({
    where: { id: userId },
    data: {
      verificationToken: token,
      verificationTokenExpires: expiresAt,
    },
  })

  return { token, expiresAt }
}

/**
 * Send verification email using SMTP
 */
export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
): Promise<VerificationResult> {
  try {
    // Generate verification URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ikmisocial.web.id'
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${token}`

    // Email HTML content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">IKMI SOCIAL</h1>
          <p style="color: rgba(255,255,255,0.8); margin-top: 10px;">Sekolah Tinggi Manajemen Informatika dan Komputer</p>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Halo, ${name}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Terima kasih telah mendaftar di IKMI Social. Untuk melanjutkan dan mengaktifkan akun Anda, silakan verifikasi alamat email dengan mengeklik tombol di bawah ini:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
              Verifikasi Email Saya
            </a>
          </div>
          <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
            Atau salin dan tempel link ini ke browser Anda:
          </p>
          <p style="color: #667eea; word-break: break-all; font-size: 13px; background: #fff; padding: 10px; border-radius: 5px; border: 1px solid #eee;">
            ${verificationUrl}
          </p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin-bottom: 10px;">
              ⏰ Link ini akan kedaluwarsa dalam <strong>24 jam</strong>.
            </p>
            <p style="color: #999; font-size: 12px;">
              Jika Anda tidak merasa mendaftar akun di IKMI Social, Anda dapat mengabaikan email ini dengan aman.
            </p>
          </div>
        </div>
        <div style="padding: 20px; text-align: center; background: #333; color: #999; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} IKMI Social. All rights reserved.</p>
          <p style="margin: 5px 0 0 0;">Sekolah Tinggi Manajemen Informatika dan Komputer</p>
        </div>
      </div>
    `

    // Log for development
    console.log('='.repeat(60))
    console.log('📧 SENDING VERIFICATION EMAIL')
    console.log('='.repeat(60))
    console.log(`To: ${email}`)
    console.log(`Name: ${name}`)
    console.log(`Verification URL: ${verificationUrl}`)
    console.log('='.repeat(60))

    // Check if SMTP password is configured
    if (!SMTP_CONFIG.auth.pass) {
      console.warn('⚠️ SMTP_PASSWORD not configured. Email will not be sent.')
      console.log('📝 Verification URL for testing:', verificationUrl)
      return {
        success: true,
        verificationUrl,
        token,
        error: 'SMTP not configured (check .env for SMTP_PASSWORD)',
      }
    }

    // Create transporter and send email
    const transporter = createTransporter()
    
    const info = await transporter.sendMail({
      from: `"IKMI Social" <${SMTP_CONFIG.auth.user}>`,
      to: email,
      subject: '✉️ Verifikasi Email Anda - IKMI Social',
      html: htmlContent,
      text: `
Halo ${name}!

Terima kasih telah mendaftar di IKMI Social.

Untuk memverifikasi email Anda, silakan kunjungi link berikut:
${verificationUrl}

Link ini akan kedaluwarsa dalam 24 jam.

Jika Anda tidak merasa mendaftar, abaikan email ini.

© ${new Date().getFullYear()} IKMI Social
      `.trim(),
    })

    console.log('✅ Email sent successfully!')
    console.log('Message ID:', info.messageId)

    return {
      success: true,
      verificationUrl,
      token,
      messageId: info.messageId,
    }
  } catch (error) {
    console.error('❌ Error sending verification email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send verification email',
    }
  }
}

/**
 * Send resend verification email
 */
export async function sendResendVerificationEmail(
  email: string,
  name: string,
  token: string
): Promise<VerificationResult> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ikmisocial.web.id'
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${token}`

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">IKMI SOCIAL</h1>
          <p style="color: rgba(255,255,255,0.8); margin-top: 10px;">Verifikasi Ulang Email</p>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Halo, ${name}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Anda meminta untuk mengirim ulang email verifikasi. Klik tombol di bawah untuk memverifikasi alamat email Anda:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
              Verifikasi Email Saya
            </a>
          </div>
          <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
            Atau salin link ini:
          </p>
          <p style="color: #667eea; word-break: break-all; font-size: 13px; background: #fff; padding: 10px; border-radius: 5px; border: 1px solid #eee;">
            ${verificationUrl}
          </p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              ⏰ Link ini akan kedaluwarsa dalam <strong>24 jam</strong>.
            </p>
          </div>
        </div>
        <div style="padding: 20px; text-align: center; background: #333; color: #999; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} IKMI Social. All rights reserved.</p>
        </div>
      </div>
    `

    console.log('📧 Resending verification email to:', email)

    if (!SMTP_CONFIG.auth.pass) {
      console.warn('⚠️ SMTP_PASSWORD not configured.')
      return {
        success: true,
        verificationUrl,
        token,
      }
    }

    const transporter = createTransporter()
    
    const info = await transporter.sendMail({
      from: `"IKMI Social" <${SMTP_CONFIG.auth.user}>`,
      to: email,
      subject: '🔄 Verifikasi Ulang Email - IKMI Social',
      html: htmlContent,
      text: `
Halo ${name}!

Anda meminta untuk mengirim ulang email verifikasi.

Klik link berikut untuk verifikasi:
${verificationUrl}

Link berlaku 24 jam.

© ${new Date().getFullYear()} IKMI Social
      `.trim(),
    })

    console.log('✅ Resend email sent successfully!')

    return {
      success: true,
      verificationUrl,
      token,
      messageId: info.messageId,
    }
  } catch (error) {
    console.error('❌ Error resending verification email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to resend verification email',
    }
  }
}

/**
 * Verify email token
 */
export async function verifyEmailToken(token: string): Promise<{
  success: boolean
  userId?: string
  error?: string
}> {
  try {
    const user = await db.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: {
          gte: new Date(), // Token must not be expired
        },
      },
    })

    if (!user) {
      return {
        success: false,
        error: 'Token verifikasi tidak valid atau sudah kedaluwarsa',
      }
    }

    // Update user as verified and clear token
    await db.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
      },
    })

    return {
      success: true,
      userId: user.id,
    }
  } catch (error) {
    console.error('Error verifying email token:', error)
    return {
      success: false,
      error: 'Terjadi kesalahan saat verifikasi',
    }
  }
}

/**
 * Check if user is verified
 */
export async function isUserVerified(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { isVerified: true },
  })
  return user?.isVerified ?? false
}
