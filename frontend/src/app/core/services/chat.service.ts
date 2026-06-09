import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatRequest, ChatResponse } from '../models/chat.model';
import { environment } from '../../../environments/environment';

export interface QuestionItem {
  sessionId: string;
  question: string;
  questionDate: string;
  answer: string | null;
  answerDate: string | null;
}

export interface QuestionsPage {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  items: QuestionItem[];
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  sendMessage(sessionId: string, content: string): Observable<ChatResponse> {
    const request: ChatRequest = { sessionId, content };
    return this.http.post<ChatResponse>(`${this.base}/chat/message`, request);
  }

  getQuestions(search: string, page: number, pageSize = 10): Observable<QuestionsPage> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (search.trim()) params = params.set('search', search.trim());
    return this.http.get<QuestionsPage>(`${this.base}/chat/questions`, { params });
  }
}
