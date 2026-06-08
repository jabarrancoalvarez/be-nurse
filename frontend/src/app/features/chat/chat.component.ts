import { Component, inject, signal, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../core/services/chat.service';

interface Message {
  content: string;
  isFromUser: boolean;
  time: Date;
}

@Component({
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, AfterViewChecked {
  private chatService = inject(ChatService);

  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  messages = signal<Message[]>([]);
  input = '';
  sessionId = '';
  sending = signal(false);

  ngOnInit() {
    this.sessionId = sessionStorage.getItem('be-nurse-session') ?? crypto.randomUUID();
    sessionStorage.setItem('be-nurse-session', this.sessionId);

    this.messages.set([{
      content: 'Hola, soy del equipo de BE-nurse. Puedes preguntarme lo que necesites de forma completamente anonima. Sin juicios.',
      isFromUser: false,
      time: new Date()
    }]);
  }

  ngAfterViewChecked() {
    this.messagesEnd?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  send() {
    const content = this.input.trim();
    if (!content || this.sending()) return;

    this.messages.update(msgs => [...msgs, { content, isFromUser: true, time: new Date() }]);
    this.input = '';
    this.sending.set(true);

    this.chatService.sendMessage(this.sessionId, content).subscribe({
      next: res => {
        this.messages.update(msgs => [...msgs, { content: res.message, isFromUser: false, time: new Date() }]);
        this.sending.set(false);
      },
      error: () => {
        this.messages.update(msgs => [...msgs, {
          content: 'Ha ocurrido un error. Por favor, intentalo de nuevo.',
          isFromUser: false,
          time: new Date()
        }]);
        this.sending.set(false);
      }
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }
}
