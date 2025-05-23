import {
  Directive,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[dsTabulatableObjects]',
  standalone: true,
})
/**
 * Directive used as a hook to know where to inject the dynamic listable object component
 */
export class TabulatableObjectsDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
