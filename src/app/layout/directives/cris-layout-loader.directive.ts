import { Directive, ViewContainerRef } from '@angular/core';
/**
 * Directive hook used to place the dynamic child component
 */
@Directive({
  selector: '[dsCrisLayoutLoader]'
})
export class CrisLayoutLoaderDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
