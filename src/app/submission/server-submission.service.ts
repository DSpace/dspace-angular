import { Injectable } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';

import { SubmissionService } from './submission.service';
import { SubmissionObject } from '../core/submission/models/submission-object.model';

@Injectable()
export class ServerSubmissionService extends SubmissionService {

  createSubmission(): Observable<SubmissionObject> {
    return observableOf(null);
  }

  retrieveSubmission(submissionId): Observable<SubmissionObject> {
    return observableOf(null);
  }

  startAutoSave(submissionId) {
    return;
  }

  stopAutoSave() {
    return;
  }
}
