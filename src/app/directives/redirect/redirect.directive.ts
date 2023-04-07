import { Directive, HostListener, Input } from '@angular/core';
import { RedirectService } from '../../redirect/redirect.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: ':not(a):not(area)[dsRedirect]'
})
export class RedirectDirective {
  constructor(readonly redirect: RedirectService) {
  }

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('dsRedirect') url: string;

  @HostListener('click') onClick() {
    // Fallbakcs to default if no url is specified
    if (!this.url) {
      return true;
    }
    // Navigates on the requested link redirecting when necessary
    this.redirect.navigate(this.url);
    // Prevents default
    return false;
  }
}
