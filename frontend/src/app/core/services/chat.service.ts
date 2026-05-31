import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatRequest, ChatResponse } from '../models/chat.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  sendMessage(sessionId: string, content: string): Observable<ChatResponse> {
    const request: ChatRequest = { sessionId, content };
    return this.http.post<ChatResponse>(`${this.base}/chat/message`, request);
  }
}
