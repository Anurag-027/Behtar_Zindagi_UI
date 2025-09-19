import { Component, ElementRef, ViewChild, effect, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { animate, style, transition, trigger, query, stagger } from '@angular/animations';
import { ChatService, ChatMessage } from './chat.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  template: `
    <div class="flex flex-col min-h-0 h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)] max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl">
      <header class="px-5 py-4 bg-gradient-to-r from-emerald-700 via-emerald-600 to-lime-600 text-emerald-50 flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shadow">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-emerald-50">
            <path d="M12 2c-2.5 2.6-4.2 5.6-4.2 8.4 0 3.9 3 7.1 4.2 8.2 1.2-1.1 4.2-4.3 4.2-8.2C16.2 7.6 14.5 4.6 12 2z"/>
          </svg>
        </div>
        <div>
          <div class="font-semibold tracking-wide">Behtar Zindagi (Agro-Tech)</div>
        </div>
      </header>

      <div class="relative flex-1 min-h-0">
        <!-- Nature-inspired background: light soil -> fresh field gradient with soft organic highlights -->
        <div class="absolute inset-0 bg-gradient-to-br from-stone-100 via-emerald-50 to-lime-50"></div>
        <div class="absolute inset-0 opacity-60" style="background-image: radial-gradient(600px 200px at 15% 10%, rgba(34,197,94,0.12) 0, transparent 70%), radial-gradient(500px 220px at 85% 20%, rgba(190,242,100,0.15) 0, transparent 70%), radial-gradient(700px 260px at 20% 85%, rgba(245,208,66,0.10) 0, transparent 70%);"></div>
        <div class="absolute inset-0" style="mask-image: radial-gradient(1000px 600px at 50% 20%, black, transparent 70%);"></div>

        <div #scrollContainer class="relative z-10 h-full overflow-y-auto p-4 sm:p-6 pb-28">
          <div class="space-y-3">
            <div *ngFor="let msg of messages(); trackBy: trackById">
              <div [class]="msg.from === 'user' ? 'flex justify-start' : 'flex justify-end'">
                <div class="max-w-[90%] sm:max-w-[70%]">
                  <div [class]="bubbleClass(msg.from)" [@fadeSlide]>
                    <div class="flex items-start gap-2">
                      <div *ngIf="msg.from === 'bot'" class="shrink-0 mt-0.5 h-6 w-6 rounded-full bg-gradient-to-br from-emerald-500 to-lime-500 shadow-sm flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                          <path d="M12 2c-2.5 2.6-4.2 5.6-4.2 8.4 0 3.9 3 7.1 4.2 8.2 1.2-1.1 4.2-4.3 4.2-8.2C16.2 7.6 14.5 4.6 12 2z"/>
                        </svg>
                      </div>
                      <p class="whitespace-pre-wrap break-words flex-1">{{ msg.text }}</p>
                    </div>
                    <span class="block text-[10px] text-emerald-900/50 mt-1 text-right">{{ time(msg.timestamp) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="isTyping()" class="flex justify-end">
              <div class="max-w-[70%]">
                <div class="rounded-3xl rounded-br-md px-4 py-2 bg-emerald-100/80 text-emerald-900 inline-flex items-center gap-2 shadow-lg shadow-emerald-900/10">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.2s]"></span>
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0s]"></span>
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div class="border-t border-emerald-900/10 bg-gradient-to-r from-emerald-50/80 to-lime-50/80 backdrop-blur px-3 py-3 sticky bottom-0 z-20 pb-4">
        <div class="flex items-end gap-2">
          <button type="button" (click)="toggleEmoji()" class="shrink-0 p-2.5 rounded-xl text-emerald-800 hover:text-emerald-900 hover:bg-emerald-100 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-emerald-500" aria-label="Emoji">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Zm-3.5-9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM7.757 15.243a1 1 0 0 1 1.414 0A3.999 3.999 0 0 0 12 16.657a4 4 0 0 0 2.829-1.171 1 1 0 0 1 1.414 1.414A6 6 0 0 1 12 18.657a6 6 0 0 1-4.243-1.757 1 1 0 0 1 0-1.657Z"/>
            </svg>
          </button>
          <div class="relative flex-1">
            <input #inputEl type="text" [(ngModel)]="draft" (keyup.enter)="send()" placeholder="Ask about crops, machines..." class="w-full border border-emerald-900/10 bg-white/70 text-emerald-900 placeholder:text-emerald-800/60 rounded-2xl py-3 pl-4 pr-14 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-inner shadow-emerald-900/10" />
            <button type="button" (click)="send()" class="absolute right-1.5 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-white shadow-lg shadow-emerald-700/20 hover:shadow-emerald-600/20 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3 3l9 3m-6 6l12-3-9 12m-3-9l9 3" />
              </svg>
            </button>
          </div>
        </div>

        <div *ngIf="showEmoji()" class="mt-3 p-3 border border-emerald-900/10 rounded-2xl bg-emerald-50/80 backdrop-blur shadow-lg shadow-emerald-900/10 max-h-56 overflow-y-auto grid grid-cols-8 gap-1 text-xl">
          <button class="hover:bg-emerald-100 rounded-lg p-1 transition" *ngFor="let e of emojis" (click)="appendEmoji(e)">{{ e }}</button>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(6px)' }),
        animate('220ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('listStagger', [
      transition(':enter', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(8px)' }),
          stagger(40, [
            animate('180ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ChatbotComponent {
  @ViewChild('scrollContainer') private scrollContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('inputEl') private inputEl?: ElementRef<HTMLInputElement>;

  draft = '';
  showEmoji = signal(false);
  isTyping = signal(false);
  messages: any;

  emojis = ['😀','😁','😂','🤣','😊','😍','😘','🤔','👍','👏','🙏','🔥','💡','✅','❓','🎉','🤖','🌟','💬','📌','📎','🧠','⚡️','✨','💯'];

  constructor(private chat: ChatService) {
    this.messages = this.chat.messages.asReadonly();
    effect(() => {
      const _ = this.messages();
      queueMicrotask(() => this.scrollToBottomSmooth());
    });
  }

  bubbleClass(from: 'user' | 'bot'): string {
    // User: fresh sky-to-leaf gradient; Bot: earthy leaf-to-sage gradient
    return from === 'user'
      ? 'rounded-3xl rounded-tl-md px-4 py-3 text-emerald-950 bg-gradient-to-r from-emerald-200/90 to-lime-200/90 shadow-xl shadow-emerald-900/10'
      : 'rounded-3xl rounded-br-md px-4 py-3 text-emerald-950 bg-gradient-to-r from-emerald-100/90 to-amber-100/90 shadow-xl shadow-amber-900/10';
  }

  time(ts: number): string {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  toggleEmoji() { this.showEmoji.update(v => !v); }
  appendEmoji(e: string) { this.draft += e; this.focusInput(); }

  send() {
    const text = this.draft.trim();
    if (!text) return;
    this.chat.sendUserMessage(text);
    this.draft = '';
    this.showEmoji.set(false);
    this.showTypingFor(1000);
  }

  private showTypingFor(ms: number) {
    this.isTyping.set(true);
    setTimeout(() => this.isTyping.set(false), ms);
  }

  private scrollToBottomSmooth() {
    const el = this.scrollContainer?.nativeElement;
    if (!el) return;
    const start = el.scrollTop;
    const end = el.scrollHeight - el.clientHeight;
    const distance = end - start;
    if (Math.abs(distance) < 2) { el.scrollTop = end; return; }
    const duration = 260;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.scrollTop = start + distance * ease;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  private focusInput() { this.inputEl?.nativeElement.focus(); }

  trackById = (_: number, item: ChatMessage) => item.id;
}
