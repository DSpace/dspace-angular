import { Injectable } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';

import { SubmissionService } from './submission.service';
import { SubmissionObject } from '../core/submission/models/submission-object.model';
import { RemoteData } from '../core/data/remote-data';

@Injectable()
export class ServerSubmissionService extends SubmissionService {

  createSubmission(): Observable<SubmissionObject> {
    return observableOf(null);
  }

  retrieveSubmission(submissionId): Observable<RemoteData<SubmissionObject>> {
    return observableOf(null);
  }

  startAutoSave(submissionId) {
    return;
  }

  stopAutoSave() {
    return;
  }
}
