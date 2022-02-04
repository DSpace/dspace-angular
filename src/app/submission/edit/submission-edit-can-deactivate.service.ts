import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PendingChangesGuardComponentInterface } from './pending-changes/pending-changes.guard';
import { SubmissionService } from '../submission.service';
import { map } from 'rxjs/operators';
import { SubmissionState } from '../submission.reducers';
import { SubmissionObjectState } from '../objects/submission-objects.reducer';

@Injectable({
  providedIn: 'root'
})
export class SubmissionEditCanDeactivateService implements PendingChangesGuardComponentInterface {

  constructor(
    private submissionService: SubmissionService,
  ) { }

  public canDeactivate(): Observable<boolean> {
    return this.submissionService.hasUnsavedModification().pipe(
      map((hasUnsavedModification) => !hasUnsavedModification),
    );
  }
  /**
   * get value from redux for discard submission
   * @returns Observable boolen
   */
  public checkForSubmissionDiscard(): Observable<SubmissionObjectState> {
   return this.submissionService.getDiscard().pipe(map( (data: SubmissionState) => data.objects));
  }

}
