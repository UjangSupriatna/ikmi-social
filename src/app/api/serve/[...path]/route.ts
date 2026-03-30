import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// Define the absolute upload directory - MUST match the upload route
const UPLOAD_BASE_DIR = '/home/z/my-project/upload'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params
    
    if (!pathSegments || pathSegments.length === 0) {
      return NextResponse.json({ error: 'No file path' }, { status: 400 })
    }

    // Build the file path using the absolute upload directory
    const filePath = path.join(UPLOAD_BASE_DIR, ...pathSegments)
    const normalizedPath = path.normalize(filePath)
    
    // Security: prevent directory traversal
    if (!normalizedPath.startsWith(UPLOAD_BASE_DIR)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    console.log('Looking for file at:', normalizedPath)

    if (!existsSync(normalizedPath)) {
      console.error('File not found:', normalizedPath)
      return NextResponse.json({ 
        error: 'File not found', 
        path: pathSegments.join('/'),
        checkedPath: normalizedPath
      }, { status: 404 })
    }

    const fileBuffer = await readFile(normalizedPath)
    const fileStats = await stat(normalizedPath)

    const ext = path.extname(normalizedPath).toLowerCase()
    const contentTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.bmp': 'image/bmp',
    }
    const contentType = contentTypes[ext] || 'application/octet-stream'

    console.log('Serving file:', normalizedPath, 'Content-Type:', contentType)

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileStats.size.toString(),
        // Disable caching to ensure fresh images are always shown
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'ETag': `"${fileStats.mtime.getTime()}"`,
        'Last-Modified': fileStats.mtime.toUTCString(),
      },
    })
  } catch (error) {
    console.error('Serve error:', error)
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 })
  }
}
