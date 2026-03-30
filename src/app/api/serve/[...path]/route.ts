import { NextRequest, NextResponse } from 'next/server'
import { readFile, access, stat } from 'fs/promises'
import path from 'path'

// ==================== PATH RESOLUTION ====================
// HARUS sama dengan upload route

function getUploadDir(): string {
  // 1. Env variable (prioritas tertinggi)
  if (process.env.UPLOAD_BASE_DIR) return process.env.UPLOAD_BASE_DIR
  if (process.env.UPLOAD_PATH) return process.env.UPLOAD_PATH

  // 2. Deteksi standalone mode (production)
  const cwd = process.cwd()
  if (cwd.includes('.next/standalone')) {
    const parts = cwd.split(path.sep)
    const idx = parts.lastIndexOf('.next')
    if (idx > 0) {
      return parts.slice(0, idx).join(path.sep) + '/public/uploads'
    }
  }

  // 3. Fallback default
  return path.join(cwd, 'public', 'uploads')
}

// ==================== GET /api/serve/[...path] ====================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params

    if (!pathSegments || pathSegments.length === 0) {
      return NextResponse.json({ error: 'No file path' }, { status: 400 })
    }

    const filename = pathSegments.join('/')

    // Security: cegah directory traversal
    if (filename.includes('..') || filename.startsWith('/') || filename.includes('\0')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const uploadDir = getUploadDir()
    const filePath = path.join(uploadDir, filename)
    const normalizedPath = path.normalize(filePath)

    // Pastikan path tidak keluar dari upload dir
    if (!normalizedPath.startsWith(uploadDir)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    // Cek file ada
    try {
      await access(normalizedPath, require('fs').constants.R_OK)
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
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

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileStats.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'ETag': `"${fileStats.mtime.getTime()}"`,
      },
    })
  } catch (error) {
    console.error('[SERVE] Error:', error)
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 })
  }
}
