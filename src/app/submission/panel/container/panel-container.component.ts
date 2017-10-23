import { Component, Input, Type, ViewChild, } from '@angular/core';

import { PanelDirective } from '../panel.directive';
import { PanelDataObject } from '../panel.model';

@Component({
  templateUrl: './panel-container.component.html'
})
export class PanelContainerComponent {
  @Input() sectionData: PanelDataObject;
  panelComponentType: string;

  @ViewChild('panelRef') panelRef: PanelDirective;

  public removePanel(event) {
    event.preventDefault();
    event.stopPropagation();
    this.panelRef.removePanel(this.sectionData.submissionId, this.sectionData.panelId);
  }
}
