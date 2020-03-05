import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';

import { SubmissionState } from '../../submission.reducers';
import { SetDuplicateDecisionAction } from '../../objects/submission-objects.actions';
import { submissionSectionDataFromIdSelector } from '../../selectors';
import { WorkspaceitemSectionDetectDuplicateObject } from '../../../core/submission/models/workspaceitem-section-deduplication.model';
import { isEmpty, isNotEmpty } from '../../../shared/empty.util';

@Injectable()
export class DetectDuplicateService {

  constructor(private store: Store<SubmissionState>) {
  }

  getDuplicateMatches(submissionId: string, sectionId: string) {
    return this.store.select(submissionSectionDataFromIdSelector(submissionId, sectionId)).pipe(
      map((sectionData: WorkspaceitemSectionDetectDuplicateObject) => {
        return (isEmpty(sectionData)) ? {matches: {}} : sectionData
      }),
      startWith({matches: {}}),
      distinctUntilChanged());
  }

  getDuplicateMatchesByScope(submissionId: string, sectionId: string, isWorkFlow: boolean) {
    return this.getDuplicateMatches(submissionId, sectionId).pipe(
      map((item: WorkspaceitemSectionDetectDuplicateObject) => {
        const outputObject: WorkspaceitemSectionDetectDuplicateObject = {} as WorkspaceitemSectionDetectDuplicateObject;
        Object.keys(item)
          .filter((key) => {
            if (isWorkFlow) {
              return isNotEmpty(item[key].workflowDecision);
            } else {
              return isNotEmpty(item[key].submitterDecision);
            }
          })
          .forEach((key) => {
            outputObject[key] = item[key];
          });
        return outputObject;
      })
    );
  }

  getDuplicateTotalMatches(submissionId: string, sectionId: string) {
    return this.getDuplicateMatches(submissionId, sectionId).pipe(
      map((sectionData: WorkspaceitemSectionDetectDuplicateObject) => Object.keys(sectionData.matches).length),
      distinctUntilChanged());
  }

  saveDuplicateDecision(submissionId: string, sectionId: string): void {
    this.store.dispatch(new SetDuplicateDecisionAction(submissionId, sectionId));
  }
}
