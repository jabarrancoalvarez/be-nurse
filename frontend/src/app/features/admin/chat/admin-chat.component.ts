import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

interface Session {
  sessionId: string;
  messageCount: number;
  lastMessage: string;
  lastAt: string;
  hasUnreplied: boolean;
}

interface ChatMessage {
  id: number;
  sessionId: string;
  content: string;
  isFromUser: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-admin-chat',
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './admin-chat.component.html',
  styleUrl: './admin-chat.component.scss'
})
export class AdminChatComponent implements OnInit {
  private http = inject(HttpClient);
  auth = inject(AuthService);

  sessions = signal<Session[]>([]);
  activeSession = signal<Session | null>(null);
  messages = signal<ChatMessage[]>([]);
  reply = '';
  loading = signal(true);
  sending = signal(false);
  errorMsg = signal('');

  ngOnInit() {
    this.loadSessions();
  }

  loadSessions() {
    this.http.get<Session[]>(`${environment.apiUrl}/admin/chat/sessions`).subscribe({
      next: data => { this.sessions.set(data); this.loading.set(false); this.errorMsg.set(''); },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(`Error ${err.status}: ${err.status === 401 ? 'Sesión caducada — cierra sesión y vuelve a entrar' : 'No se pudieron cargar las sesiones'}`);
      }
    });
  }

  openSession(s: Session) {
    this.activeSession.set(s);
    this.http.get<ChatMessage[]>(`${environment.apiUrl}/admin/chat/${s.sessionId}/messages`).subscribe(
      msgs => this.messages.set(msgs)
    );
  }

  sendReply() {
    const session = this.activeSession();
    if (!this.reply.trim() || !session || this.sending()) return;
    this.sending.set(true);
    this.http.post<ChatMessage>(`${environment.apiUrl}/admin/chat/${session.sessionId}/reply`, { content: this.reply }).subscribe({
      next: msg => {
        this.messages.update(m => [...m, msg]);
        this.reply = '';
        this.sending.set(false);
        this.loadSessions();
      },
      error: () => this.sending.set(false)
    });
  }
}
