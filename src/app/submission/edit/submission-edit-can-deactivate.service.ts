import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PendingChangesGuardComponentInterface } from './pending-changes/pending-changes.guard';
import { SubmissionService } from '../submission.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubmissionEditCanDeactivateService implements PendingChangesGuardComponentInterface {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private submissionService: SubmissionService,
  ) { }

  public canDeactivate(): Observable<boolean> {
    return this.submissionService.hasUnsavedModification().pipe(
      map((hasUnsavedModification) => !hasUnsavedModification),
    );
  }

}
