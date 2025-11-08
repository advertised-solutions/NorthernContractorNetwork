import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAuthToken, errorResponse, successResponse, validateRequestBody } from '@/lib/api-helpers';
import { Conversation } from '@/types';

// POST /api/messages/conversations - Create or get conversation
export async function POST(request: NextRequest) {
  try {
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    const body = await request.json();
    
    if (!body.participantId && !body.participants) {
      return errorResponse('Missing required field: participantId or participants', 400);
    }
    
    const participants = body.participants || [uid, body.participantId].sort();
    
    // Check if conversation already exists
    const existingConversations = await adminDb
      .collection('conversations')
      .where('participants', '==', participants)
      .get();
    
    if (!existingConversations.empty) {
      const convData = existingConversations.docs[0].data();
      const conversation: Conversation = {
        id: existingConversations.docs[0].id,
        participants: convData.participants,
        listingId: convData.listingId,
        lastMessage: convData.lastMessage,
        lastMessageAt: convData.lastMessageAt?.toDate(),
        unreadCount: convData.unreadCount || {},
        createdAt: convData.createdAt?.toDate() || new Date(),
        updatedAt: convData.updatedAt?.toDate() || new Date(),
      };
      return successResponse(conversation);
    }
    
    // Create new conversation
    const conversationData = {
      participants,
      listingId: body.listingId,
      unreadCount: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const docRef = await adminDb.collection('conversations').add(conversationData);
    
    const conversation: Conversation = {
      id: docRef.id,
      participants,
      listingId: body.listingId,
      unreadCount: {},
      createdAt: conversationData.createdAt,
      updatedAt: conversationData.updatedAt,
    };
    
    return successResponse(conversation, 'Conversation created successfully');
  } catch (error) {
    console.error('Error creating conversation:', error);
    return errorResponse('Failed to create conversation', 500);
  }
}

// GET /api/messages/conversations - Get user conversations
export async function GET(request: NextRequest) {
  try {
    const uid = await verifyAuthToken(request);
    
    if (!uid) {
      return errorResponse('Unauthorized', 401);
    }
    
    const conversationsSnapshot = await adminDb
      .collection('conversations')
      .where('participants', 'array-contains', uid)
      .orderBy('lastMessageAt', 'desc')
      .get();
    
    const conversations: Conversation[] = conversationsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        participants: data.participants,
        listingId: data.listingId,
        lastMessage: data.lastMessage,
        lastMessageAt: data.lastMessageAt?.toDate(),
        unreadCount: data.unreadCount || {},
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    });
    
    return successResponse(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return errorResponse('Failed to fetch conversations', 500);
  }
}

