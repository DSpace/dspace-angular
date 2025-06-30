import {
  Directive,
  Input,
} from '@angular/core';

/* eslint-disable @angular-eslint/directive-class-suffix */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[routerLink]',
  standalone: true,
})
export class RouterLinkDirectiveStub {
  @Input() routerLink: any;
  @Input() queryParams: any;
}
