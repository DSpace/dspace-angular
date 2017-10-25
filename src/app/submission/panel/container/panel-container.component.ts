import { Component, Input, ViewChild } from '@angular/core';

import { PanelDirective } from '../panel.directive';
import { PanelDataObject } from '../panel-data.model';
import {PanelService} from "../panel.service";
import {Observable} from "rxjs/Observable";
import {SubmissionPanelObject} from "../../objects/submission-objects.reducer";
import {submissionPanelFromIdSelector} from "../../selectors";
import {Store} from "@ngrx/store";
import {SubmissionState} from "../../submission.reducers";

@Component({
  templateUrl: './panel-container.component.html',
  styleUrls: ['./panel-container.component.scss'],
})
export class PanelContainerComponent {
  @Input() sectionData: PanelDataObject;
  panelComponentType: string;
  // private panelService: PanelService;
  @Input() store: Store<SubmissionState>;

  @ViewChild('panelRef') panelRef: PanelDirective;

  public removePanel(event) {
    event.preventDefault();
    event.stopPropagation();
    this.panelRef.removePanel(this.sectionData.submissionId, this.sectionData.panelId);
  }
}
