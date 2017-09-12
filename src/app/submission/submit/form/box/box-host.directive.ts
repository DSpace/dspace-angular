import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dsBoxHost]',
  exportAs: 'boxHostRef'
})
export class BoxHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }
}
