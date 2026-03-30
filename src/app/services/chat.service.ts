import { Injectable, signal } from '@angular/core';
import { Firestore, collection, query, where, orderBy, onSnapshot, addDoc, getDocs, doc, setDoc, getDoc, Timestamp } from '@angular/fire/firestore';
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
      collection(this.firestore, 'recent_chats'),
      where('users', 'array-contains', currentUser.uid),
      orderBy('timestamp', 'desc')
    );

    onSnapshot(chatsQuery, async (snapshot) => {
      const chatPromises = snapshot.docs.map(async (chatDoc) => {
        const data = chatDoc.data();
        const users = data['users'] as string[];
        const otherUserId = users.find(id => id !== currentUser.uid);

        let otherUser = null;
        if (otherUserId) {
          const userDoc = await getDoc(doc(this.firestore, 'users', otherUserId));
          if (userDoc.exists()) {
            otherUser = userDoc.data();
          }
        }

        return {
          id: chatDoc.id,
          ...data,
          otherUser // Augmenting with profile data like your Android RecentChat
        } as any;
      });

      const chatsWithProfiles = await Promise.all(chatPromises);
      console.log('Loaded chats with profiles:', chatsWithProfiles);
      // Sort by timestamp descending (newest first) to match the Firestore query and typical chat inbox behavior
      chatsWithProfiles.sort((a, b) => {
        const aTime = a.timestamp instanceof Timestamp ? a.timestamp.toMillis() : (typeof a.timestamp === 'number' ? a.timestamp : 0);
        const bTime = b.timestamp instanceof Timestamp ? b.timestamp.toMillis() : (typeof b.timestamp === 'number' ? b.timestamp : 0);
        
        return bTime - aTime;
      });
      this.chats.set(chatsWithProfiles);
    });
  }

  async loadMessages(chatId: string) {
    const messagesQuery = query(
      collection(this.firestore, `chats/${chatId}/messages`),
      orderBy('timestamp', 'asc')
    );

    this.messages.set([]); // Clear existing messages while loading new ones

    onSnapshot(messagesQuery, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      console.log('Loaded messages:', messages);
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
      timestamp: Timestamp.now()
    };

    // Add message to chats collection
    await addDoc(collection(this.firestore, `chats/${chatId}/messages`), message);

    // Update recent_chats for chat list - use Firestore Timestamp like Android
    await setDoc(doc(this.firestore, 'recent_chats', chatId), {
      lastMessage: text,
      timestamp: Timestamp.now(),
      users: [currentUser.uid, receiverId]
    }, { merge: true });
  }

  async createChat(participantId: string): Promise<string> {
    const currentUser = this.authService.currentUser();
    if (!currentUser) throw new Error('Not authenticated');

    // Generate chatId same way as Android: sorted user IDs
    const chatId = currentUser.uid < participantId
      ? `${currentUser.uid}_${participantId}`
      : `${participantId}_${currentUser.uid}`;

    // Check if chat already exists
    const chatDoc = await getDoc(doc(this.firestore, 'recent_chats', chatId));

    if (chatDoc.exists()) {
      return chatId;
    }

    // Create new chat in recent_chats
    await setDoc(doc(this.firestore, 'recent_chats', chatId), {
      users: [currentUser.uid, participantId],
      lastMessage: '',
      timestamp: Timestamp.now()
    });

    return chatId;
  }
}
