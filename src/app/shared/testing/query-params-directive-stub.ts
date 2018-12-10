import { Directive, Input } from '@angular/core';

/* tslint:disable:directive-class-suffix */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[queryParams]',
})
export class QueryParamsDirectiveStub {
  @Input() queryParams: any;
}
