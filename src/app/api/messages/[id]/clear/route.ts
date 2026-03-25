import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params
    
    // Get current user from session/cookie
    const userId = request.cookies.get('userId')?.value
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Update the participant's clearedAt timestamp
    // This marks the chat as "cleared" only for this user
    await db.conversationParticipant.update({
      where: {
        userId_conversationId: {
          userId,
          conversationId
        }
      },
      data: {
        clearedAt: new Date()
      }
    })
    
    return NextResponse.json({ success: true, message: 'Chat cleared for you' })
  } catch (error) {
    console.error('Error clearing chat:', error)
    return NextResponse.json(
      { error: 'Failed to clear chat' },
      { status: 500 }
    )
  }
}
