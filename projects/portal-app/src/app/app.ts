import { Component } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { PORTAL_TRANSLATION } from '../i18n';

@Component({
  selector: 'app-portal-root',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './app.html'
})
export class App {
  protected readonly translation = PORTAL_TRANSLATION;
}
