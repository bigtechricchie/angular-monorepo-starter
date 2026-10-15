import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { REFERENCE_TRANSLATION } from '../../../i18n';

@Component({
  selector: 'app-reference-home',
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class Home {
  protected readonly translation = REFERENCE_TRANSLATION.home;
}
