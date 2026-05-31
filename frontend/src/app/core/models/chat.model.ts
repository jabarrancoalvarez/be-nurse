export interface ChatMessage {
  id: number;
  sessionId: string;
  content: string;
  isFromUser: boolean;
  createdAt: Date;
}

export interface ChatRequest {
  sessionId: string;
  content: string;
}

export interface ChatResponse {
  message: string;
}
