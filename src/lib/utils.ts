import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert image path to proper URL for display
 * Handles various path formats and converts them to API serve path
 * 
 * Supported formats:
 * - /api/serve/... (already correct)
 * - /uploads/... (old format)
 * - uploads/... (without leading slash)
 * - http://... or https://... (external URLs)
 * - data:... (base64)
 */
export function getImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null
  
  // Trim whitespace
  const trimmedPath = imagePath.trim()
  if (!trimmedPath) return null
  
  // If it's already a full URL or base64, return as is
  if (trimmedPath.startsWith('http://') || 
      trimmedPath.startsWith('https://') || 
      trimmedPath.startsWith('data:')) {
    return trimmedPath
  }
  
  // If it's already using API serve, return as is
  if (trimmedPath.startsWith('/api/serve/')) {
    return trimmedPath
  }
  
  // Remove query params (like ?t=timestamp)
  const cleanPath = trimmedPath.split('?')[0]
  
  // Normalize path - remove leading slash if present
  const normalizedPath = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath
  
  // Check if it's an uploads path (various formats)
  // uploads/profiles/file.jpg -> /api/serve/profiles/file.jpg
  // profiles/file.jpg -> /api/serve/profiles/file.jpg
  if (normalizedPath.startsWith('uploads/')) {
    return `/api/serve/${normalizedPath.replace('uploads/', '')}`
  }
  
  // If it looks like a type/filename pattern (e.g., profiles/avatar.jpg)
  // Check if first segment is a known upload type
  const knownTypes = ['profiles', 'posts', 'events', 'groups', 'messages']
  const firstSegment = normalizedPath.split('/')[0]
  
  if (knownTypes.includes(firstSegment)) {
    return `/api/serve/${normalizedPath}`
  }
  
  // Otherwise, assume it's a relative path and prepend /
  return `/${cleanPath}`
}

/**
 * Convert Google Drive share links to direct image URLs
 */
export function getDirectImageUrl(url: string): string {
  if (!url) return url
  
  const googleDriveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (googleDriveMatch) {
    return `https://drive.google.com/thumbnail?id=${googleDriveMatch[1]}&sz=w1000`
  }
  
  const googleDriveOpenMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/)
  if (googleDriveOpenMatch) {
    return `https://drive.google.com/thumbnail?id=${googleDriveOpenMatch[1]}&sz=w1000`
  }
  
  return url
}
