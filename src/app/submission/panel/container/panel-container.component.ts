import { Component, Input, Type, ViewChild, } from '@angular/core';

import { PanelDirective } from '../panel.directive';

@Component({
  templateUrl: './panel-container.component.html'
})
export class PanelContainerComponent {
  @Input() panelId: string;
  @Input() panelHeader: any;
  @Input() mandatory: boolean;
  @Input() submissionId: string;
  panelComponent: Type<any>;

  @ViewChild('panelRef') panelRef: PanelDirective;

  public removePanel(event) {
    event.preventDefault();
    event.stopPropagation();
    this.panelRef.removePanel(this.submissionId, this.panelId);
  }
}
