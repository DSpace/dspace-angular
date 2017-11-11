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

import { SectionDataModel } from '../../section/section.model';
import { SectionFactoryComponent, FactoryDataModel } from '../../section/section.factory'
import { SectionService } from '../../section/section.service';
import { SubmissionSubmitFormComponent } from '../submission-submit-form.component';
import { FormSectionComponent } from '../../section/form/section-form.component';
import { hasValue, isNotUndefined } from '../../../shared/empty.util';
import { submissionSelector, SubmissionState } from '../../submission.reducers';
import { SubmissionDefinitionState } from '../../definitions/submission-definitions.reducer';
import { AppState } from '../../../app.reducer';
import { HostWindowState } from '../../../shared/host-window.reducer';

@Component({
  selector: 'ds-submission-submit-form-box-handler',
  styleUrls: ['./submission-submit-form-section-add.component.scss'],
  templateUrl: './submission-submit-form-section-add.component.html'
})
export class SubmissionSubmitFormSectionAddComponent implements OnChanges {
  @Input() collectionId: string;
  @Input() submissionId: string;
  @Input() definitionId: string;
  sectionList: any[] = [];

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  constructor(private sectionService: SectionService, private store: Store<SubmissionState>) {}

  ngOnChanges(changes: SimpleChanges) {
    if (isNotUndefined(changes.definitionId) && hasValue(changes.definitionId.currentValue)) {
      this.subs.push(this.sectionService.getAvailableSectionList(this.submissionId, this.definitionId)
        .subscribe((sectionList) => {
          this.sectionList = sectionList;
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

  addSection(sectionId) {
    this.sectionService.addSection(this.collectionId, this.submissionId, this.definitionId, sectionId);
  }
}
