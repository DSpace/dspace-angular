import { Directive, ViewContainerRef } from '@angular/core';
import { PanelService } from './panel.service';

@Directive({
  selector: '[dsPanelsHost]',
  exportAs: 'panelsHostRef'
})
export class PanelHostDirective {

  constructor(public viewContainerRef: ViewContainerRef, private panelService: PanelService) { }

  ngAfterViewInit() {
    this.panelService.initViewContainer(this.viewContainerRef);
  }
}
