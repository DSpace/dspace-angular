import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dsCrisLayoutLoader]'
})
export class CrisLayoutLoaderDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
