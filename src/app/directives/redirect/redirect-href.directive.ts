import {
  Directive,
  HostBinding,
} from '@angular/core';

import { RedirectService } from '../../redirect/redirect.service';
import { RedirectDirective } from './redirect.directive';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'a[dsRedirect],area[dsRedirect]',
  standalone: true,
})
export class RedirectWithHrefDirective extends RedirectDirective {

  constructor(redirect: RedirectService) {
    super(redirect);
  }

  // Binds the requested url to the href property
  @HostBinding('href') get href() {
    return this.url;
  }
}
