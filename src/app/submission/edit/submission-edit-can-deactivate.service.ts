import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PendingChangesGuardComponentInterface } from './pending-changes/pending-changes.guard';
import { SubmissionService } from '../submission.service';

@Injectable({
  providedIn: 'root'
})
export class SubmissionEditCanDeactivateService implements PendingChangesGuardComponentInterface {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private submissionService: SubmissionService,
  ) { }

  public canDeactivate(id: string): Observable<boolean> {
    return combineLatest([
      this.submissionService.isSubmissionDiscarding(id),
      this.submissionService.hasUnsavedModification()
    ]).pipe(
      map(([isSubmissionDiscarding,hasUnsavedModification]) => isSubmissionDiscarding || !hasUnsavedModification),
    );
  }

}
