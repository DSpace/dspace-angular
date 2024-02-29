import { Directive, ViewContainerRef } from '@angular/core';

/**
 * Directive used as a hook to know where to inject the dynamic loaded component
 */
@Directive({
  selector: '[dsDynamicComponentLoader]'
})
export class DynamicComponentLoaderDirective {

  constructor(
    public viewContainerRef: ViewContainerRef,
  ) {
  }

}
