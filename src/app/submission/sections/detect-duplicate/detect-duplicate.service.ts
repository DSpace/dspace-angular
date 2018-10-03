import { Store } from '@ngrx/store';
import { SubmissionState } from '../../submission.reducers';
import { Injectable } from '@angular/core';
import { SetDuplicateDecisionAction } from '../../objects/submission-objects.actions';
import { submissionSectionDataFromIdSelector } from '../../selectors';
import { WorkspaceitemSectionDetectDuplicateObject } from '../../../core/submission/models/workspaceitem-section-deduplication.model';
import { isEmpty } from '../../../shared/empty.util';

@Injectable()
export class DetectDuplicateService {

  constructor(private store: Store<SubmissionState>) {
  }

  getDuplicateMatches(submissionId: string, sectionId: string) {
    return this.store.select(submissionSectionDataFromIdSelector(submissionId, sectionId))
      .map((sectionData: WorkspaceitemSectionDetectDuplicateObject) => {
        return (isEmpty(sectionData)) ? {matches: {}} : sectionData
      })
      .startWith({matches: {}})
      .distinctUntilChanged();
  }

  getDuplicateTotalMatches(submissionId: string, sectionId: string) {
    return this.getDuplicateMatches(submissionId, sectionId)
      .map((sectionData: WorkspaceitemSectionDetectDuplicateObject) => Object.keys(sectionData.matches).length)
      .distinctUntilChanged();
  }

  saveDuplicateDecision(submissionId: string, sectionId: string): void {
    this.store.dispatch(new SetDuplicateDecisionAction(submissionId, sectionId));
  }
}
