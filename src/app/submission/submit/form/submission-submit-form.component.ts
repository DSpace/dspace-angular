import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { createSelector, Store } from '@ngrx/store';

import { PanelHostDirective } from '../../panel/panel-host.directive';
import { submissionSelector, SubmissionState } from '../../submission.reducers';
import { NewSubmissionFormAction } from '../../objects/submission-objects.actions';
import { InitDefinitionsAction } from '../../definitions/submission-definitions.actions';
import { isUndefined } from '../../../shared/empty.util';

@Component({
  selector: 'ds-submission-submit-form',
  styleUrls: ['./submission-submit-form.component.scss'],
  templateUrl: './submission-submit-form.component.html'
})

export class SubmissionSubmitFormComponent implements AfterViewInit, OnInit {
  submissionId: string;
  definitionId: string;

  @ViewChild(PanelHostDirective) public panelsHost: PanelHostDirective;

  constructor(private store:Store<SubmissionState>) {}

  ngOnInit() {
    this.store.dispatch(new InitDefinitionsAction());
    this.submissionId = 'Submission1';
    this.getDefaultSubmissionDefinition()
      .subscribe((definitionId) => {
         this.definitionId = definitionId;
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.store.dispatch(new NewSubmissionFormAction(this.submissionId, this.definitionId));
    });
  }

  getDefaultSubmissionDefinition() {
    const definitionsSelector = createSelector(submissionSelector, (state: SubmissionState) => state.definitions);
    // console.log(this.store.select(definitionsSelector));
    return this.store.select(definitionsSelector)
      .map((definitions) => {
        const keys = Object.keys(definitions)
          .filter((definitionId) => !isUndefined(definitions) && definitions[definitionId].isDefault);
        return keys.pop();
      })
      .distinctUntilChanged();
  }
}
