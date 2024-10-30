import {
  Directive,
  ViewContainerRef,
} from '@angular/core';

/**
 * Directive used as a hook to know where to inject the dynamic loaded component
 */
@Directive({
  selector: '[dsDsoEditMetadataValueFieldDirective]',
})
export class DsoEditMetadataValueFieldLoaderDirective {
  constructor(
    public viewContainerRef: ViewContainerRef,
  ) {
  }
}
