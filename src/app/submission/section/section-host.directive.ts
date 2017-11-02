import { Directive, ViewContainerRef } from '@angular/core';
import { SectionService } from './section.service';

@Directive({
  selector: '[dsSectionsHost]'
})
export class SectionHostDirective {

  constructor(public viewContainerRef: ViewContainerRef, private sectionService: SectionService) { }

  ngAfterViewInit() {
    this.sectionService.initViewContainer(this.viewContainerRef);
  }
}
