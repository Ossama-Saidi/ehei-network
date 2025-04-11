import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

// ✅ Interface pour assurer la structure des événements
interface NotificationEvent {
  event: 'post-reaction' | 'chat-message' | 'post-comment' | 'friend-invite';
  data: any;
}

@Injectable()
export class NotificationSse {
  private eventStream = new Subject<NotificationEvent>(); // ✅ SSE Stream

  // ✅ Permet aux clients d'écouter les notifications SSE
  getEventStream(): Observable<{ event: string; data: any }> {
    return this.eventStream.asObservable();
  }

  // ✅ Envoie une notification SSE générique
  public notifyClients(event: NotificationEvent['event'], data: any) {
    this.eventStream.next({ event, data });
  }

  // ✅ Notification pour une réaction à un post
  notifyPostReaction(postId: string, userId: string, reactionType: string) {
    this.notifyClients('post-reaction', { postId, userId, reactionType });
  }

  // ✅ Notification pour un message de chat
  notifyChatMessage(senderId: string, receiverId: string, message: string) {
    this.notifyClients('chat-message', { senderId, receiverId, message });
  }

  // ✅ Notification pour un commentaire sur un post
  notifyComment(postId: string, userId: string, commentText: string) {
    this.notifyClients('post-comment', { postId, userId, commentText });
  }

  // ✅ Notification pour une invitation d’amitié
  notifyFriendInvite(senderId: string, receiverId: string) {
    this.notifyClients('friend-invite', {
      senderId,
      receiverId,
      message: `vous a envoyé une invitation d’amitié`,
    });
  }
}
