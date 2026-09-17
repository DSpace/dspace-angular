import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Observable,
  of,
} from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ConfirmationModalComponent } from '../../../shared/confirmation-modal/confirmation-modal.component';
import { SubmissionEditCanDeactivateService } from '../submission-edit-can-deactivate.service';
import { ThemedSubmissionEditComponent } from '../themed-submission-edit.component';


/**
 * Route deactivation guard that protects against accidental navigation away
 * from the submission edit page when there are unsaved changes.
 *
 * Delegates to {@link SubmissionEditCanDeactivateService} to check whether
 * the current submission (identified by the route `id` parameter) has any
 * pending changes.
 *
 * Deactivation logic:
 * - If **no pending changes** are detected, navigation is allowed immediately
 *   by emitting `true`.
 * - If **pending changes** exist, a {@link ConfirmationModalComponent} is opened
 *   asking the user to confirm or cancel the navigation. The guard then returns
 *   the modal's `response` observable, which emits:
 *   - `true` — user confirmed, navigation proceeds.
 *   - `false` — user cancelled, navigation is blocked.
 *
 * @param component - The {@link ThemedSubmissionEditComponent} instance being deactivated.
 * @param route - The current activated route snapshot, used to extract the submission `id`.
 * @param state - The target router state snapshot (unused, required by the interface).
 * @returns An `Observable<boolean>` that resolves to `true` to allow navigation
 *          or `false` to block it.
 */
export const pendingChangesGuard: CanDeactivateFn<ThemedSubmissionEditComponent> = (
  component: ThemedSubmissionEditComponent,
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<boolean> => {
  const modalService = inject(NgbModal);
  const canDeactivateService = inject(SubmissionEditCanDeactivateService);

  return canDeactivateService.canDeactivate(route?.params?.id).pipe(
    switchMap((canDeactivate) => {
      if (canDeactivate) {
        return of(true);
      } else {
        const modalRef = modalService.open(ConfirmationModalComponent);
        const labelPrefix = 'confirmation-modal.pending-changes.';
        modalRef.componentInstance.headerLabel = labelPrefix + 'header';
        modalRef.componentInstance.infoLabel = labelPrefix + 'info';
        modalRef.componentInstance.cancelLabel = labelPrefix + 'cancel';
        modalRef.componentInstance.confirmLabel = labelPrefix + 'confirm';
        modalRef.componentInstance.brandColor = 'danger';
        modalRef.componentInstance.confirmIcon = 'fas fa-trash';
        return modalRef.componentInstance.response as Observable<boolean>;
      }
    }),
  );
};
