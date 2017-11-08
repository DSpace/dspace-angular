import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { createSelector, Store } from '@ngrx/store';

import { SectionHostDirective } from '../section/section-host.directive';
import { submissionSelector, SubmissionState } from '../submission.reducers';
import { NewSubmissionFormAction } from '../objects/submission-objects.actions';
import { InitDefaultDefinitionAction } from '../definitions/submission-definitions.actions';
import { isEmpty, isUndefined } from '../../shared/empty.util';

@Component({
  selector: 'ds-submission-submit-form',
  styleUrls: ['./submission-submit-form.component.scss'],
  templateUrl: './submission-submit-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})

export class SubmissionSubmitFormComponent implements OnInit {
  collectionId = '1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb';
  submissionId: string;
  definitionId: string;
  isLoading = true;

  @ViewChild(SectionHostDirective) public sectionsHost: SectionHostDirective;

  constructor(private store:Store<SubmissionState>) {}

  ngOnInit() {
    // @TODO retrieve submission ID by rest
    this.submissionId = 'Submission1';
    this.store.dispatch(new InitDefaultDefinitionAction(this.collectionId, this.submissionId));
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
