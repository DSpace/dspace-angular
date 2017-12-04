import {
  AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges,
  ViewChild
} from '@angular/core';
import { createSelector, Store } from '@ngrx/store';

import { SectionHostDirective } from '../section/section-host.directive';
import { submissionSelector, SubmissionState } from '../submission.reducers';
import { NewSubmissionFormAction } from '../objects/submission-objects.actions';
import { hasValue, isEmpty, isNotEmpty, isUndefined } from '../../shared/empty.util';
import { UploadFilesComponentOptions } from '../../shared/upload-files/upload-files-component-options.model';
import { SubmissionRestService } from '../submission-rest.service';
import { submissionObjectFromIdSelector } from '../selectors';
import { SubmissionObjectEntry } from '../objects/submission-objects.reducer';
import { WorkspaceitemSectionsObject } from '../models/workspaceitem-sections.model';

@Component({
  selector: 'ds-submission-submit-form',
  styleUrls: ['./submission-submit-form.component.scss'],
  templateUrl: './submission-submit-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})

export class SubmissionSubmitFormComponent implements OnChanges, OnInit {
  @Input() collectionId: string;
  @Input() sections: WorkspaceitemSectionsObject;
  @Input() submissionId: string;

  definitionId: string;
  loading = true;
  uploadFilesOptions: UploadFilesComponentOptions = {
    url: '',
    authToken: null,
    disableMultipart: false,
    itemAlias: null
  }

  @ViewChild(SectionHostDirective) public sectionsHost: SectionHostDirective;

  constructor(private store:Store<SubmissionState>, private submissionRestService: SubmissionRestService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.collectionId && this.submissionId) {
      this.submissionRestService.getEndpoint('workspaceitems')
        .filter((href: string) => isNotEmpty(href))
        .distinctUntilChanged()
        .subscribe((endpointURL) => {
          this.uploadFilesOptions.url = endpointURL.concat(`/${this.submissionId}`);
          this.store.dispatch(new NewSubmissionFormAction(this.collectionId, this.submissionId, this.sections));
        });
    }
  }

  ngOnInit() {
    this.isLoading();
    this.getDefaultSubmissionDefinition()
      .subscribe((definitionId) => {
        this.definitionId = definitionId;
        this.loading = false;
      });
  }

  isLoading() {
    this.store.select(submissionObjectFromIdSelector(this.submissionId))
      .subscribe((state: SubmissionObjectEntry) => {
        this.loading = isUndefined(state) ? true : state.isLoading
      })
  }

  getDefaultSubmissionDefinition() {
    const definitionsSelector = createSelector(submissionSelector, (state: SubmissionState) => state.definitions);
    return this.store.select(definitionsSelector)
      .filter((definitions) => !isUndefined(definitions) && !isEmpty(definitions))
      .map((definitions) => {
        const keys = Object.keys(definitions)
          .filter((definitionId) => definitions[definitionId].isDefault);
        return keys.pop();
      })
      .distinctUntilChanged();
  }

  onCollectionChange(collectionId) {
    this.collectionId = collectionId;
  }

}
