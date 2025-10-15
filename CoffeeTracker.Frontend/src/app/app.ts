import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <main>
      <a [routerLink]="['/']">
        <header class="brand-name">
          <img class="brand-logo" src="/assets/logo.svg" alt="logo" aria-hidden="true" />
        </header>
      </a>
      <section class="content">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styleUrls: ['./app.css'], // or './app.component.css' if you rename
  imports: [RouterOutlet, RouterLink],
})
export class App {
  title = 'homes';
}
