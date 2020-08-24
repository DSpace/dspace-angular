import { Component } from '@angular/core';
import { CookiesService } from '../shared/cookies/cookies.service';

@Component({
  selector: 'ds-footer',
  styleUrls: ['footer.component.scss'],
  templateUrl: 'footer.component.html'
})
export class FooterComponent {
  constructor(private cookies: CookiesService) {

  }

  dateObj: number = Date.now();

  showCookieSettings() {
    this.cookies.showSettings();
    return false;
  }
}
