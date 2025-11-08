import { adminDb } from './firebase-admin';
import { Notification, NotificationType } from '@/types';

/**
 * Create a notification in Firestore
 */
export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  link?: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await adminDb.collection('notifications').add({
      userId,
      type,
      title,
      message,
      read: false,
      link,
      metadata: metadata || {},
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string, userId: string): Promise<void> {
  try {
    const notificationDoc = await adminDb.collection('notifications').doc(notificationId).get();
    
    if (!notificationDoc.exists) {
      throw new Error('Notification not found');
    }
    
    if (notificationDoc.data()!.userId !== userId) {
      throw new Error('Unauthorized: Cannot update another user\'s notification');
    }
    
    await adminDb.collection('notifications').doc(notificationId).update({
      read: true,
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  try {
    const notifications = await adminDb
      .collection('notifications')
      .where('userId', '==', userId)
      .where('read', '==', false)
      .get();
    
    const batch = adminDb.batch();
    notifications.docs.forEach((doc) => {
      batch.update(adminDb.collection('notifications').doc(doc.id), { read: true });
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string, userId: string): Promise<void> {
  try {
    const notificationDoc = await adminDb.collection('notifications').doc(notificationId).get();
    
    if (!notificationDoc.exists) {
      throw new Error('Notification not found');
    }
    
    if (notificationDoc.data()!.userId !== userId) {
      throw new Error('Unauthorized: Cannot delete another user\'s notification');
    }
    
    await adminDb.collection('notifications').doc(notificationId).delete();
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
}

