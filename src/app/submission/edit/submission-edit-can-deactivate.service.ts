import { Injectable } from '@angular/core';
import {
  combineLatest,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { SubmissionService } from '../submission.service';

/**
 * Interface for pending-changes.guard.ts, describe the returned value of the route guard.
 */
interface PendingChangesGuardComponentInterface {
  canDeactivate: (id: string) => boolean | Observable<boolean>;
}


/**
 * Service that determines whether the submission edit route can be safely deactivated.
 *
 * Implements {@link PendingChangesGuardComponentInterface} and is consumed by
 * {@link pendingChangesGuard} to perform the actual deactivation check, keeping
 * the guard itself thin and this logic independently testable.
 *
 * Deactivation logic:
 *
 * Navigation away from the submission edit page is allowed (`true`) when **either**
 * of the following conditions is met:
 * - The submission is currently being **discarded** (`isSubmissionDiscarding = true`),
 *   meaning the user has already chosen to abandon it.
 * - There are **no unsaved modifications** (`hasUnsavedModification = false`),
 *   meaning the form is clean and nothing would be lost.
 *
 * If neither condition is met — i.e. the submission is not being discarded **and**
 * there are unsaved changes — the method emits `false`, signalling to the guard
 * that a confirmation prompt should be shown before allowing navigation.
 */

@Injectable({
  providedIn: 'root',
})
export class SubmissionEditCanDeactivateService implements PendingChangesGuardComponentInterface {

  constructor(
    private submissionService: SubmissionService,
  ) { }

  public canDeactivate(id: string): Observable<boolean> {
    return combineLatest([
      this.submissionService.isSubmissionDiscarding(id),
      this.submissionService.hasUnsavedModification(),
    ]).pipe(
      map(([isSubmissionDiscarding,hasUnsavedModification]) => isSubmissionDiscarding || !hasUnsavedModification),
    );
  }

}
