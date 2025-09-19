import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf],
  template: `
    <nav class="bg-emerald-900/10 backdrop-blur border-b border-emerald-900/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <a routerLink="/" class="text-xl font-extrabold bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">Behtar Zindagi</a>
          </div>
          <div class="hidden md:flex items-center gap-6">
            <a routerLink="/" routerLinkActive="text-emerald-900" [routerLinkActiveOptions]="{ exact: true }" class="relative text-emerald-800 hover:text-emerald-900 transition-colors">
              Home
              <span class="pointer-events-none absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-emerald-500 to-lime-500 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a routerLink="/about" routerLinkActive="text-emerald-900" class="relative text-emerald-800 hover:text-emerald-900 transition-colors">
              About
              <span class="pointer-events-none absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-emerald-500 to-lime-500 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a routerLink="/services" routerLinkActive="text-emerald-900" class="relative text-emerald-800 hover:text-emerald-900 transition-colors">
              Services
              <span class="pointer-events-none absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-emerald-500 to-lime-500 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a routerLink="/chatbot" routerLinkActive="text-emerald-900" class="relative text-emerald-800 hover:text-emerald-900 transition-colors">
              Chatbot
              <span class="pointer-events-none absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-emerald-500 to-lime-500 transition-all duration-200 group-hover:w-full"></span>
            </a>
          </div>
          <div class="md:hidden">
            <button (click)="toggle()" class="inline-flex items-center justify-center p-2 rounded-md text-emerald-900 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-600" aria-expanded="false">
              <span class="sr-only">Open main menu</span>
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="open() ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="md:hidden" *ngIf="open()">
        <div class="space-y-1 px-2 pb-3 pt-2">
          <a (click)="close()" routerLink="/" routerLinkActive="bg-emerald-100 text-emerald-900" [routerLinkActiveOptions]="{ exact: true }" class="block rounded-md px-3 py-2 text-base font-medium text-emerald-800 hover:bg-emerald-100">Home</a>
          <a (click)="close()" routerLink="/about" routerLinkActive="bg-emerald-100 text-emerald-900" class="block rounded-md px-3 py-2 text-base font-medium text-emerald-800 hover:bg-emerald-100">About</a>
          <a (click)="close()" routerLink="/services" routerLinkActive="bg-emerald-100 text-emerald-900" class="block rounded-md px-3 py-2 text-base font-medium text-emerald-800 hover:bg-emerald-100">Services</a>
          <a (click)="close()" routerLink="/chatbot" routerLinkActive="bg-emerald-100 text-emerald-900" class="block rounded-md px-3 py-2 text-base font-medium text-emerald-800 hover:bg-emerald-100">Chatbot</a>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  private readonly isOpen = signal(false);
  open = this.isOpen.asReadonly();
  toggle() { this.isOpen.update(v => !v); }
  close() { this.isOpen.set(false); }
}
