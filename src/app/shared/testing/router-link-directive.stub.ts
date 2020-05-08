import { Directive, Input } from '@angular/core';

/* tslint:disable:directive-class-suffix */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[routerLink]',
})
export class RouterLinkDirectiveStub {
  @Input() routerLink: any;
}
