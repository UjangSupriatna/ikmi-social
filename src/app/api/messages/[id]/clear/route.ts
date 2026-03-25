import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params
    
    // Delete all messages in the conversation
    await db.message.deleteMany({
      where: {
        conversationId
      }
    })
    
    return NextResponse.json({ success: true, message: 'Chat cleared' })
  } catch (error) {
    console.error('Error clearing chat:', error)
    return NextResponse.json(
      { error: 'Failed to clear chat' },
      { status: 500 }
    )
  }
}
