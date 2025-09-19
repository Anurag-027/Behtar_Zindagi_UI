import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AboutComponent } from './about.component';
import { ServicesComponent } from './services.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'chatbot', loadComponent: () => import('./chatbot.component').then(m => m.ChatbotComponent) },
  { path: '**', redirectTo: '' }
];
