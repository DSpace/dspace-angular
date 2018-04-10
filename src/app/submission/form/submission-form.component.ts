import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import { SectionHostDirective } from '../section/section-host.directive';
import {
  CancelSubmissionFormAction,
  LoadSubmissionFormAction,
  ResetSubmissionFormAction
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
import { SubmissionService } from '../submission.service';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'ds-submission-submit-form',
  styleUrls: ['./submission-form.component.scss'],
  templateUrl: './submission-form.component.html',
})
export class SubmissionFormComponent implements OnChanges, OnDestroy {
  @Input() collectionId: string;
  @Input() sections: WorkspaceitemSectionsObject;
  @Input() selfUrl: string;
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

  protected isActive: boolean;
  protected subs: Subscription[] = [];

  @ViewChild(SectionHostDirective) public sectionsHost: SectionHostDirective;

  constructor(private authService: AuthService,
              private changeDetectorRef: ChangeDetectorRef,
              private store: Store<SubmissionState>,
              private submissionRestService: SubmissionRestService,
              private submissionService: SubmissionService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.collectionId && this.submissionId) {
      this.isActive = true;
      this.subs.push(
        this.submissionRestService.getEndpoint('workspaceitems')
          .filter((href: string) => isNotEmpty(href))
          .distinctUntilChanged()
          .subscribe((endpointURL) => {
            this.uploadFilesOptions.authToken = this.authService.buildAuthHeader();
            this.uploadFilesOptions.url = endpointURL.concat(`/${this.submissionId}`);
            this.definitionId = this.submissionDefinition.name;
            this.store.dispatch(new LoadSubmissionFormAction(this.definitionId, this.collectionId, this.submissionId, this.selfUrl, this.sections));
            this.changeDetectorRef.detectChanges();
          }),

        this.store.select(submissionObjectFromIdSelector(this.submissionId))
          .filter((submission: SubmissionObjectEntry) => isNotUndefined(submission) && this.isActive)
          .subscribe((submission: SubmissionObjectEntry) => {
            if (this.loading !== submission.isLoading) {
              this.loading = submission.isLoading;
              this.changeDetectorRef.detectChanges();
            }
          })
      );
      this.submissionService.startAutoSave(this.submissionId);
    }
  }

  ngOnDestroy() {
    this.isActive = false;
    this.submissionService.stopAutoSave();
    this.store.dispatch(new CancelSubmissionFormAction());
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
      this.store.dispatch(new ResetSubmissionFormAction(this.definitionId, this.collectionId, this.submissionId, workspaceItemObject.self, this.sections));
    } else {
      this.changeDetectorRef.detectChanges();
    }
  }

  isLoading() {
    return isUndefined(this.loading) || this.loading === true;
  }
}
