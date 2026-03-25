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
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar />
      <div class="max-w-4xl mx-auto pt-20 pb-8 flex h-[calc(100vh-5rem)]">
        <div class="w-1/3 border-r border-gray-300 bg-white">
          <div class="p-4 border-b border-gray-300">
            <h2 class="text-xl font-semibold">Messages</h2>
          </div>
          <div class="overflow-y-auto">
            @for (chat of chatService.chats(); track chat.id) {
              <div class="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-200">
                <p class="font-semibold">Chat {{ chat.id }}</p>
              </div>
            }
          </div>
        </div>
        <div class="flex-1 bg-white flex flex-col">
          <div class="flex-1 overflow-y-auto p-4">
            @for (message of chatService.messages(); track message.id) {
              <div class="mb-4" [class.text-right]="message.senderId === currentUserId">
                <div
                  class="inline-block px-4 py-2 rounded-lg"
                  [class.bg-blue-500]="message.senderId === currentUserId"
                  [class.text-white]="message.senderId === currentUserId"
                  [class.bg-gray-200]="message.senderId !== currentUserId"
                >
                  {{ message.text }}
                </div>
              </div>
            }
          </div>
          <div class="p-4 border-t border-gray-300">
            <form (ngSubmit)="sendMessage()" class="flex gap-2">
              <input
                type="text"
                [(ngModel)]="messageText"
                name="message"
                placeholder="Type a message..."
                class="flex-1 px-4 py-2 border border-gray-300 rounded-full"
              />
              <button
                type="submit"
                class="px-6 py-2 bg-blue-500 text-white rounded-full font-semibold"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
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
