import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { TimeAgoPipe } from '../../components/post-details/time-ago.pipe';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterLink, RouterLinkActive, TimeAgoPipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  messageText = '';
  currentUserId = '';
  chatId = '';
  private authService = inject(AuthService);

  constructor(
    public chatService: ChatService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) this.currentUserId = user.uid;

    this.chatService.loadChats();
    this.route.paramMap.subscribe(params => {
      this.chatId = params.get('id') || '';
      if (this.chatId) {
        this.chatService.loadMessages(this.chatId);
      }
    });
  }

  async sendMessage() {
    if (!this.messageText.trim() || !this.chatId) return;

    // Find the current chat to identify the receiver
    const chat = this.chatService.chats().find(c => c.id === this.chatId) as any;
    const receiverId = chat?.users?.find((id: string) => id !== this.currentUserId) || '';

    await this.chatService.sendMessage(this.chatId, receiverId, this.messageText);
    this.messageText = '';
  }
}
