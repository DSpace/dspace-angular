import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
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
    return this.store.pipe(
      select(submissionSectionDataFromIdSelector(submissionId, sectionId)),
      map((sectionData: WorkspaceitemSectionDetectDuplicateObject) => {
        let matches: {};
        if (isNotEmpty(sectionData)) {
          matches = sectionData;
        }
        return matches;
      }),
      startWith({ matches: {} }),
      distinctUntilChanged());
  }

  getDuplicateMatchesByScope(submissionId: string, sectionId: string, isWorkFlow: boolean) {
    return this.getDuplicateMatches(submissionId, sectionId).pipe(
      map((item: WorkspaceitemSectionDetectDuplicateObject) => {
        const outputObject: WorkspaceitemSectionDetectDuplicateObject = {} as WorkspaceitemSectionDetectDuplicateObject;
        outputObject.matches = {};
        Object.keys(item.matches)
          .filter((key) => {
            let output = false;
            if (isWorkFlow) {
              output = isEmpty(item.matches[key].workflowDecision);
            } else {
              output = isEmpty(item.matches[key].submitterDecision);
            }
            return output;
          })
          .forEach((key) => {
            outputObject.matches[key] = item.matches[key];
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
