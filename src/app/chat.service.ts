import { Injectable, WritableSignal, signal } from '@angular/core';

export type Sender = 'user' | 'bot';
export interface ChatMessage {
  id: number;
  text: string;
  from: Sender;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private nextId = 1;
  readonly messages: WritableSignal<ChatMessage[]> = signal<ChatMessage[]>([
    {
      id: this.nextId++,
      text:
        "I am your Behtar Zindagi assistant 🤖\n\n" +
        "How can I help you? ❓\nJust type below 👇\n\n" +
        "👉 \"For field plowing\" – Farming machines (tillage, sowing, harvesting)\n" +
        "👉 \"For harvesting crops\" – Harvester, chaff cutter, etc.\n" +
        "👉 \"To increase animal milk\" – Animal health, mineral mixture, Milkogen, etc.\n" +
        "👉 \"Machines for business\" – Machines made from milk/cow dung, paper plate machine, incense stick machine, feed machine, etc.\n\n" +
        "💡 Now tell me, what are you looking for? ❓",
      from: 'bot',
      timestamp: Date.now()
    }
  ]);

  sendUserMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = { id: this.nextId++, text: trimmed, from: 'user', timestamp: Date.now() };
    this.messages.update(list => [...list, userMsg]);
    this.replyAfterDelay(trimmed);
  }

  private replyAfterDelay(userText: string) {
    setTimeout(() => {
      const reply: ChatMessage = {
        id: this.nextId++,
        text: `You said: "${userText}"` ,
        from: 'bot',
        timestamp: Date.now()
      };
      this.messages.update(list => [...list, reply]);
    }, 1000);
  }

  clear() {
    this.messages.set([]);
  }
}
