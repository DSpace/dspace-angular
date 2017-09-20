import { Directive, ViewContainerRef } from '@angular/core';
import { BoxService } from './box.service';

@Directive({
  selector: '[dsBoxHost]',
  exportAs: 'boxHostRef'
})
export class BoxHostDirective {

  constructor(public viewContainerRef: ViewContainerRef, private boxService: BoxService) { }

  ngAfterViewInit() {
    this.boxService.initViewContainer(this.viewContainerRef);
  }
}
