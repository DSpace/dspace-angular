import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';

import { SubmissionState } from '../../submission.reducers';
import { SetDuplicateDecisionAction } from '../../objects/submission-objects.actions';
import { submissionSectionDataFromIdSelector } from '../../selectors';
import { WorkspaceitemSectionDetectDuplicateObject } from '../../../core/submission/models/workspaceitem-section-deduplication.model';
import { isEmpty, isNotEmpty } from '../../../shared/empty.util';

/**
 * A service that provides methods used in the deduplication process.
 */
@Injectable()
export class DetectDuplicateService {

  /**
   * Initialize service variables.
   * @param {Store<SubmissionState>} store
   */
  constructor(private store: Store<SubmissionState>) {
  }

  /**
   * Get the list of the possible duplications.
   * @param {string} submissionId
   *    The submission id
   * @param {string} sectionId
   *    The section id
   * @return Observable<Object>
   *    Returns the list of the possible duplications
   */
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

  /**
   * Get the list of the possible duplications for a specific submission scope.
   * @param {string} submissionId
   *    The submission id
   * @param {string} sectionId
   *    The section id
   * @param {boolean} isWorkFlow
   *    If TRUE the submission scope is the 'workflow'; 'workspace' otherwise.
   * @return Observable<Object>
   *    Returns the list of the possible duplications
   */
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

  /**
   * Get the count of the possible duplications.
   * @param {string} submissionId
   *    The submission id
   * @param {string} sectionId
   *    The section id
   * @return Observable<number>
   *    Returns the number of the possible duplications
   */
  getDuplicateTotalMatches(submissionId: string, sectionId: string) {
    return this.getDuplicateMatches(submissionId, sectionId).pipe(
      map((sectionData: WorkspaceitemSectionDetectDuplicateObject) => Object.keys(sectionData.matches).length),
      distinctUntilChanged());
  }

  /**
   * Save the decision into the store.
   * @param {string} submissionId
   *    The submission id
   * @param {string} sectionId
   *    The section id
   */
  saveDuplicateDecision(submissionId: string, sectionId: string): void {
    this.store.dispatch(new SetDuplicateDecisionAction(submissionId, sectionId));
  }
}
