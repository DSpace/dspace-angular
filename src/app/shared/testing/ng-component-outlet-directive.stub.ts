import { Directive, Input } from '@angular/core';

/* tslint:disable:directive-class-suffix */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngComponentOutlet]',
})
export class NgComponentOutletDirectiveStub {
  @Input() ngComponentOutlet: any;
}
