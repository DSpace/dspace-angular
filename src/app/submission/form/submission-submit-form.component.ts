import {
  AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges,
  ViewChild
} from '@angular/core';
import { createSelector, Store } from '@ngrx/store';

import { SectionHostDirective } from '../section/section-host.directive';
import { submissionSelector, SubmissionState } from '../submission.reducers';
import { NewSubmissionFormAction } from '../objects/submission-objects.actions';
import { InitDefaultDefinitionAction } from '../definitions/submission-definitions.actions';
import { hasValue, isEmpty, isNotEmpty, isUndefined } from '../../shared/empty.util';
import { UploadFilesComponentOptions } from '../../shared/upload-files/upload-files-component-options.model';
import { SubmissionRestService } from '../submission-rest.service';

@Component({
  selector: 'ds-submission-submit-form',
  styleUrls: ['./submission-submit-form.component.scss'],
  templateUrl: './submission-submit-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})

export class SubmissionSubmitFormComponent implements OnChanges, OnInit {
  @Input() collectionId: string;
  @Input() submissionId: string;

  definitionId: string;
  isLoading = true;
  uploadFilesOptions: UploadFilesComponentOptions = {
    url: '',
    authToken: null,
    disableMultipart: false,
    itemAlias: null
  }

  @ViewChild(SectionHostDirective) public sectionsHost: SectionHostDirective;

  constructor(private store:Store<SubmissionState>, private submissionRestService: SubmissionRestService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (hasValue(changes.collectionId)
      && hasValue(changes.collectionId.currentValue)
      && hasValue(changes.submissionId)
      && hasValue(changes.submissionId.currentValue)) {
      this.submissionRestService.getEndpoint('workspaceitems')
        .filter((href: string) => isNotEmpty(href))
        .distinctUntilChanged()
        .subscribe((endpointURL) => {
          this.uploadFilesOptions.url = endpointURL.concat(`/${this.submissionId}`);
          this.store.dispatch(new NewSubmissionFormAction(this.collectionId, this.submissionId));
        });
    }
  }

  ngOnInit() {
    this.getDefaultSubmissionDefinition()
      .subscribe((definitionId) => {
        this.definitionId = definitionId;
        this.isLoading = false;
      });
  }

  getDefaultSubmissionDefinition() {
    const definitionsSelector = createSelector(submissionSelector, (state: SubmissionState) => state.definitions);
    // console.log(this.store.select(definitionsSelector));
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
