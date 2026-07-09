import {
  Directive,
  ViewContainerRef,
} from '@angular/core';
/**
 * Directive hook used to place the dynamic child component
 */
@Directive({
  selector: '[dsDynamicLayoutLoader]',
})
export class DynamicLayoutLoaderDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
