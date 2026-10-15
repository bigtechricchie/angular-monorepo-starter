import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { REFERENCE_TRANSLATION } from '../i18n';

@Component({
  selector: 'app-reference-root',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './app.html'

})
export class App {
  protected readonly translation = REFERENCE_TRANSLATION;
}
