import { Directive, ViewContainerRef } from '@angular/core';

/**
 * Directive used as a hook to know where to inject the dynamic loaded component
 */
@Directive({
  selector: '[dsSearchLabelLoader]'
})
export class SearchLabelLoaderDirective {

  constructor(
    public viewContainerRef: ViewContainerRef,
  ) {
  }

}
