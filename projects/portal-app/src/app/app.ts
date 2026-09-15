import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-portal-root',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Portal App');
}
