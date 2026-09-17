import { Injectable } from '@angular/core';
import { RemoteData } from '@dspace/core/data/remote-data';
import { SubmissionObject } from '@dspace/core/submission/models/submission-object.model';
import {
  Observable,
  of,
} from 'rxjs';

import { SubmissionService } from './submission.service';

/**
 * Instance of SubmissionService used on SSR.
 */
@Injectable()
export class ServerSubmissionService extends SubmissionService {

  /**
   * Override createSubmission parent method to return an empty observable
   *
   * @return Observable<SubmissionObject>
   *    observable of SubmissionObject
   */
  createSubmission(): Observable<SubmissionObject> {
    return of(null);
  }

  /**
   * Override retrieveSubmission parent method to return an empty observable
   *
   * @return Observable<SubmissionObject>
   *    observable of SubmissionObject
   */
  retrieveSubmission(submissionId): Observable<RemoteData<SubmissionObject>> {
    return of(null);
  }

  /**
   * Override startAutoSave parent method and return without doing anything
   *
   * @param submissionId
   *    The submission id
   */
  startAutoSave(submissionId) {
    return;
  }

  /**
   * Override startAutoSave parent method and return without doing anything
   */
  stopAutoSave() {
    return;
  }
}
