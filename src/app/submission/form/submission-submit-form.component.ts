import {
  ChangeDetectorRef, Component, Inject, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges,
  ViewChild
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { SectionHostDirective } from '../section/section-host.directive';
import {
  LoadSubmissionFormAction, ResetSubmissionFormAction,
  SaveSubmissionFormAction
} from '../objects/submission-objects.actions';
import { hasValue, isNotEmpty, isNotUndefined, isUndefined } from '../../shared/empty.util';
import { UploadFilesComponentOptions } from '../../shared/upload-files/upload-files-component-options.model';
import { SubmissionRestService } from '../submission-rest.service';
import { submissionObjectFromIdSelector } from '../selectors';
import { SubmissionObjectEntry } from '../objects/submission-objects.reducer';
import { WorkspaceitemSectionsObject } from '../../core/submission/models/workspaceitem-sections.model';
import { SubmissionDefinitionsModel } from '../../core/shared/config/config-submission-definitions.model';
import { SubmissionState } from '../submission.reducers';
import { Workspaceitem } from '../../core/submission/models/workspaceitem.model';
import { GlobalConfig } from '../../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../../config';
import { SubmissionService } from '../submission.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ds-submission-submit-form',
  styleUrls: ['./submission-submit-form.component.scss'],
  templateUrl: './submission-submit-form.component.html',
})

export class SubmissionSubmitFormComponent implements OnChanges, OnDestroy {
  @Input() collectionId: string;
  @Input() sections: WorkspaceitemSectionsObject;
  @Input() submissionDefinition: SubmissionDefinitionsModel;
  @Input() submissionId: string;

  public definitionId: string;
  public loading = true;
  public uploadFilesOptions: UploadFilesComponentOptions = {
    url: '',
    authToken: null,
    disableMultipart: false,
    itemAlias: null
  };

  protected subs: Subscription[] = [];

  @ViewChild(SectionHostDirective) public sectionsHost: SectionHostDirective;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private store: Store<SubmissionState>,
              private submissionRestService: SubmissionRestService,
              private submissionService: SubmissionService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.collectionId && this.submissionId) {
      this.subs.push(
        this.submissionRestService.getEndpoint('workspaceitems')
          .filter((href: string) => isNotEmpty(href))
          .distinctUntilChanged()
          .subscribe((endpointURL) => {
            this.uploadFilesOptions.url = endpointURL.concat(`/${this.submissionId}`);
            this.definitionId = this.submissionDefinition.name;
            this.store.dispatch(new LoadSubmissionFormAction(this.collectionId, this.submissionId, this.sections));
          }),

        this.store.select(submissionObjectFromIdSelector(this.submissionId))
          .filter((submission: SubmissionObjectEntry) => isNotUndefined(submission))
          .subscribe((submission: SubmissionObjectEntry) => {
            if (this.loading !== submission.isLoading) {
              this.loading = submission.isLoading;
              this.changeDetectorRef.detectChanges();
            }
          })
      );
      this.submissionService.startAutoSave(this.submissionId)
    }
  }

  ngOnDestroy() {
    this.submissionService.stopAutoSave();
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

  onCollectionChange(workspaceItemObject: Workspaceitem) {
    this.collectionId = workspaceItemObject.collection[0].id;
    if (this.definitionId !== workspaceItemObject.submissionDefinition[0].name) {
      this.sections = workspaceItemObject.sections;
      this.submissionDefinition = workspaceItemObject.submissionDefinition[0];
      this.definitionId = this.submissionDefinition.name;
      this.store.dispatch(new ResetSubmissionFormAction(this.collectionId, this.submissionId, this.sections));
    } else {
      this.changeDetectorRef.detectChanges();
    }
  }

  isLoading() {
    return isUndefined(this.loading) || this.loading === true;
  }
}
