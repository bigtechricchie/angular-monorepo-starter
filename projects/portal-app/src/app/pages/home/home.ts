import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PORTAL_TRANSLATION } from '../../../i18n';

@Component({
  selector: 'app-portal-home',
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class Home {
  protected readonly translation = PORTAL_TRANSLATION.home;
}
