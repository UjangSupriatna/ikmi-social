import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { writeFile, mkdir, stat } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// Define the absolute upload directory - this MUST be consistent across upload and serve
const UPLOAD_BASE_DIR = '/home/z/my-project/upload'

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let formData: FormData
    try {
      formData = await request.formData()
    } catch {
      return NextResponse.json({ error: 'Failed to parse form data' }, { status: 400 })
    }

    const file = formData.get('file') as File | null
    const type = formData.get('type') as string || 'posts'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop() || 'jpg'
    const fileName = `${type.slice(0, -1)}-${timestamp}-${randomString}.${extension}`

    // Use the absolute upload directory
    const uploadDir = path.join(UPLOAD_BASE_DIR, type)
    
    console.log('Upload directory:', uploadDir)
    
    // Create directory if it doesn't exist
    try {
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
        console.log('Created upload directory:', uploadDir)
      }
    } catch (dirError) {
      console.error('Failed to create upload directory:', dirError)
      return NextResponse.json({ error: 'Failed to create upload directory' }, { status: 500 })
    }

    // Convert file to buffer
    let buffer: Buffer
    try {
      const bytes = await file.arrayBuffer()
      buffer = Buffer.from(bytes)
    } catch {
      return NextResponse.json({ error: 'Failed to process file' }, { status: 500 })
    }

    // Write file
    const filePath = path.join(uploadDir, fileName)
    try {
      await writeFile(filePath, buffer)
      console.log('File saved to:', filePath)
    } catch (writeError) {
      console.error('Failed to write file:', writeError)
      return NextResponse.json({ error: 'Failed to save file' }, { status: 500 })
    }

    // Verify file was written
    try {
      const fileStats = await stat(filePath)
      if (fileStats.size === 0) {
        return NextResponse.json({ error: 'File is empty' }, { status: 500 })
      }
      console.log('File size:', fileStats.size, 'bytes')
    } catch {
      return NextResponse.json({ error: 'File verification failed' }, { status: 500 })
    }

    // Return API serve path
    const publicPath = `/api/serve/${type}/${fileName}`

    return NextResponse.json({
      success: true,
      path: publicPath,
      fileName,
      savedTo: filePath,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
