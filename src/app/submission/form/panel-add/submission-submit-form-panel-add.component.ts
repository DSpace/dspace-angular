import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver, forwardRef, Host, Inject,
  Input, OnChanges,
  OnDestroy, OnInit, Optional, SimpleChanges,
  ViewChild,
} from '@angular/core';

import { assign } from 'rxjs/util/assign';
import { Subscription } from 'rxjs/Subscription';
import { createSelector, Store } from '@ngrx/store';

import { PanelDataModel } from '../../panel/panel.model';
import { PanelFactoryComponent, FactoryDataModel } from '../../panel/panel.factory'
import { PanelService } from '../../panel/panel.service';
import { SubmissionSubmitFormComponent } from '../submission-submit-form.component';
import { FormPanelComponent } from '../../panel/form/panel-form.component';
import { hasValue } from '../../../shared/empty.util';
import { submissionSelector, SubmissionState } from '../../submission.reducers';
import { SubmissionDefinitionState } from '../../definitions/submission-definitions.reducer';
import { AppState } from '../../../app.reducer';
import { HostWindowState } from '../../../shared/host-window.reducer';

@Component({
  selector: 'ds-submission-submit-form-box-handler',
  styleUrls: ['./submission-submit-form-panel-add.component.scss'],
  templateUrl: './submission-submit-form-panel-add.component.html'
})
export class SubmissionSubmitFormPanelAddComponent implements OnChanges {
  @Input() submissionId: string;
  @Input() definitionId: string;
  panelList: any[] = [];

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  constructor(private panelService: PanelService, private store: Store<SubmissionState>) {}

  ngOnChanges(changes: SimpleChanges) {
    if (hasValue(changes.definitionId.currentValue)) {
      this.subs.push(this.panelService.getAvailablePanelList(this.submissionId, this.definitionId)
        .subscribe((panelList) => {
          this.panelList = panelList;
        }));
    }
  }

  /**
   * Method provided by Angular. Invoked when the instance is destroyed.
   */
  ngOnDestroy() {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

  addPanel(panelId) {
    this.panelService.addPanel(this.submissionId, this.definitionId, panelId);
  }
}
