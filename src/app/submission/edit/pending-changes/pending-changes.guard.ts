import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../../shared/confirmation-modal/confirmation-modal.component';
import { switchMap, tap } from 'rxjs/operators';
import { SubmissionEditCanDeactivateService } from '../submission-edit-can-deactivate.service';
import { SubmissionJsonPatchOperationsService } from '../../../core/submission/submission-json-patch-operations.service';

export interface PendingChangesGuardComponentInterface {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class PendingChangesGuard implements CanDeactivate<PendingChangesGuardComponentInterface> {

  constructor(
    private modalService: NgbModal,
    private canDeactivateService: SubmissionEditCanDeactivateService,
    private submissionJsonPatchOperationsService: SubmissionJsonPatchOperationsService,
  ) {
  }

  canDeactivate(): Observable<boolean> {
    return this.canDeactivateService.canDeactivate().pipe(
      switchMap((canDeactivate) => {
        if (canDeactivate) {
          return of(true);
        } else {
          const modalRef = this.modalService.open(ConfirmationModalComponent);
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
      tap((canDeactivate) => {
        if (canDeactivate) {
          this.submissionJsonPatchOperationsService.deletePendingJsonPatchOperations();
        }
      })
    );
  }

}
