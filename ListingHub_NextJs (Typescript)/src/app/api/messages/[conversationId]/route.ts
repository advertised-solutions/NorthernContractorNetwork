import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAuthToken, errorResponse, successResponse, validateRequestBody } from '@/lib/api-helpers';
import { Message } from '@/types';
import { createNotification } from '@/lib/notifications';

// POST /api/messages/[conversationId] - Send a message
export async function POST(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const conversationId = params.conversationId;
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    const body = await request.json();
    
    if (!body.content) {
      return errorResponse('Missing required field: content', 400);
    }
    
    // Check if conversation exists and user is participant
    const conversationDoc = await adminDb.collection('conversations').doc(conversationId).get();
    if (!conversationDoc.exists) {
      return errorResponse('Conversation not found', 404);
    }
    
    const conversationData = conversationDoc.data()!;
    if (!conversationData.participants.includes(uid)) {
      return errorResponse('Forbidden: Not a participant in this conversation', 403);
    }
    
    // Create message using transaction to update conversation
    const result = await adminDb.runTransaction(async (transaction) => {
      // Create message
      const messageRef = adminDb.collection('messages').doc();
      const messageData = {
        conversationId,
        senderId: uid,
        content: body.content,
        read: false,
        createdAt: new Date(),
      };
      transaction.set(messageRef, messageData);
      
      // Update conversation
      const conversationRef = adminDb.collection('conversations').doc(conversationId);
      const unreadCount = { ...conversationData.unreadCount };
      // Mark as unread for other participants
      conversationData.participants.forEach((participantId: string) => {
        if (participantId !== uid) {
          unreadCount[participantId] = (unreadCount[participantId] || 0) + 1;
        }
      });
      
      transaction.update(conversationRef, {
        lastMessage: body.content,
        lastMessageAt: new Date(),
        unreadCount,
        updatedAt: new Date(),
      });
      
      return { messageRef, messageData, conversationData };
    });
    
    // Fetch user data for response
    const userDoc = await adminDb.collection('users').doc(uid).get();
    const userData = userDoc.data();
    
    const message: Message = {
      id: result.messageRef.id,
      conversationId,
      senderId: uid,
      senderName: userData?.displayName,
      senderPhoto: userData?.photoURL,
      content: result.messageData.content,
      read: false,
      createdAt: result.messageData.createdAt,
    };
    
    // Create notification for other participants
    try {
      const otherParticipants = result.conversationData.participants.filter((p: string) => p !== uid);
      for (const participantId of otherParticipants) {
        await createNotification(
          participantId,
          'message',
          'New Message',
          `${userData?.displayName || 'Someone'} sent you a message`,
          `/dashboard-messages?conversation=${conversationId}`,
          { conversationId, senderId: uid }
        );
      }
    } catch (error) {
      console.error('Error creating message notification:', error);
      // Don't fail the request if notification fails
    }
    
    return successResponse(message, 'Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
    return errorResponse('Failed to send message', 500);
  }
}

// GET /api/messages/[conversationId] - Get messages for a conversation
export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const conversationId = params.conversationId;
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    // Check if conversation exists and user is participant
    const conversationDoc = await adminDb.collection('conversations').doc(conversationId).get();
    if (!conversationDoc.exists) {
      return errorResponse('Conversation not found', 404);
    }
    
    const conversationData = conversationDoc.data()!;
    if (!conversationData.participants.includes(uid)) {
      return errorResponse('Forbidden: Not a participant in this conversation', 403);
    }
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const lastDocId = searchParams.get('lastDocId');
    
    let query = adminDb.collection('messages').where('conversationId', '==', conversationId);
    
    // Pagination
    if (lastDocId) {
      const lastDoc = await adminDb.collection('messages').doc(lastDocId).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc) as any;
      }
    }
    
    query = query.orderBy('createdAt', 'desc').limit(limit) as any;
    
    const snapshot = await query.get();
    
    // Mark messages as read
    const unreadMessageIds = snapshot.docs
      .filter((doc) => {
        const data = doc.data();
        return !data.read && data.senderId !== uid;
      })
      .map((doc) => doc.id);
    
    if (unreadMessageIds.length > 0) {
      const batch = adminDb.batch();
      unreadMessageIds.forEach((messageId) => {
        batch.update(adminDb.collection('messages').doc(messageId), { read: true });
      });
      await batch.commit();
      
      // Update conversation unread count
      const unreadCount = { ...conversationData.unreadCount };
      unreadCount[uid] = Math.max(0, (unreadCount[uid] || 0) - unreadMessageIds.length);
      await adminDb.collection('conversations').doc(conversationId).update({ unreadCount });
    }
    
    // Fetch user data for each message
    const messages = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const userDoc = await adminDb.collection('users').doc(data.senderId).get();
        const userData = userDoc.data();
        
        return {
          id: doc.id,
          conversationId: data.conversationId,
          senderId: data.senderId,
          senderName: userData?.displayName,
          senderPhoto: userData?.photoURL,
          content: data.content,
          read: unreadMessageIds.includes(doc.id) ? true : data.read,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Message;
      })
    );
    
    return successResponse(messages.reverse()); // Reverse to show oldest first
  } catch (error) {
    console.error('Error fetching messages:', error);
    return errorResponse('Failed to fetch messages', 500);
  }
}

