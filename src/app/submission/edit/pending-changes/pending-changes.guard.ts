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
