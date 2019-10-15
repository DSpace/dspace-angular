import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dsListableObject]',
})
export class ListableObjectDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
