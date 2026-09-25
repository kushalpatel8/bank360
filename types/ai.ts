export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  sessionId: string;
  customerId?: string;
  clientNum?: number;
}

export interface ChatResponse {
  message: string;
  sessionId: string;
}
