import { Injectable } from '@angular/core';
import { SubmissionService } from './submission.service';
import { SubmissionObject } from '../core/submission/models/submission-object.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ServerSubmissionService extends SubmissionService {

  createSubmission(): Observable<SubmissionObject> {
    return Observable.of(null);
  }

  retrieveSubmission(submissionId): Observable<SubmissionObject> {
    return Observable.of(null);
  }

  startAutoSave(submissionId) {
    return;
  }

  stopAutoSave() {
    return;
  }
}
