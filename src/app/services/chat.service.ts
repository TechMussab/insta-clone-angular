import { Injectable, signal } from '@angular/core';
import { Firestore, collection, query, where, orderBy, onSnapshot, addDoc, getDocs, doc, setDoc } from '@angular/fire/firestore';
import { Chat, Message } from '../models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  chats = signal<Chat[]>([]);
  messages = signal<Message[]>([]);

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  async loadChats() {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return;

    const chatsQuery = query(
      collection(this.firestore, 'chats'),
      where('participants', 'array-contains', currentUser.uid)
    );

    onSnapshot(chatsQuery, (snapshot) => {
      const chats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Chat));
      this.chats.set(chats);
    });
  }

  async loadMessages(chatId: string) {
    const messagesQuery = query(
      collection(this.firestore, `chats/${chatId}/messages`),
      orderBy('timestamp', 'asc')
    );

    onSnapshot(messagesQuery, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      this.messages.set(messages);
    });
  }

  async sendMessage(chatId: string, receiverId: string, text: string) {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return;

    const message: Omit<Message, 'id'> = {
      senderId: currentUser.uid,
      receiverId,
      text,
      timestamp: Date.now()
    };

    await addDoc(collection(this.firestore, `chats/${chatId}/messages`), message);
  }

  async createChat(participantId: string): Promise<string> {
    const currentUser = this.authService.currentUser();
    if (!currentUser) throw new Error('Not authenticated');

    // Check if chat already exists
    const chatsQuery = query(
      collection(this.firestore, 'chats'),
      where('participants', 'array-contains', currentUser.uid)
    );
    const snapshot = await getDocs(chatsQuery);
    const existingChat = snapshot.docs.find(doc =>
      doc.data()['participants'].includes(participantId)
    );

    if (existingChat) {
      return existingChat.id;
    }

    // Create new chat
    const chatRef = doc(collection(this.firestore, 'chats'));
    await setDoc(chatRef, {
      participants: [currentUser.uid, participantId]
    });

    return chatRef.id;
  }
}
