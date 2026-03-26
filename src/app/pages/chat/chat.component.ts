import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  messageText = '';
  currentUserId = '';
  chatId = '';

  constructor(
    public chatService: ChatService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.chatId = this.route.snapshot.paramMap.get('id') || '';
    this.chatService.loadChats();
    if (this.chatId) {
      this.chatService.loadMessages(this.chatId);
    }
  }

  async sendMessage() {
    if (!this.messageText.trim() || !this.chatId) return;
    await this.chatService.sendMessage(this.chatId, '', this.messageText);
    this.messageText = '';
  }
}
