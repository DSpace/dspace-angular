import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SubmissionService } from '../submission.service';

interface PendingChangesGuardComponentInterface {
  canDeactivate: (id: string) => boolean | Observable<boolean>;
}

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
