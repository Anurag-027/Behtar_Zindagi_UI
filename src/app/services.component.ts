import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  standalone: true,
  template: `
    <section class="max-w-5xl mx-auto p-6">
      <div class="glass p-6">
        <h2 class="text-3xl font-bold text-emerald-900">Services</h2>
        <p class="text-emerald-900/70 mt-2">These are the services we offer.</p>
      </div>
    </section>
  `
})
export class ServicesComponent {}
