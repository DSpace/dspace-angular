import { Directive, OnDestroy, ViewContainerRef } from '@angular/core';
import { SectionService } from './section.service';

@Directive({
  selector: '[dsSectionsHost]'
})
export class SectionHostDirective implements OnDestroy {

  constructor(public viewContainerRef: ViewContainerRef, private sectionService: SectionService) { }

  ngAfterViewInit() {
    this.sectionService.initViewContainer(this.viewContainerRef);
  }

  ngOnDestroy() {
    this.sectionService.clearViewContainer();
  }
}
