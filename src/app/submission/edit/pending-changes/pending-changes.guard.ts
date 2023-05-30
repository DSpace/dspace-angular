import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../../shared/confirmation-modal/confirmation-modal.component';
import { switchMap } from 'rxjs/operators';
import { SubmissionEditCanDeactivateService } from '../submission-edit-can-deactivate.service';
import { ThemedSubmissionEditComponent } from '../themed-submission-edit.component';

@Injectable({
  providedIn: 'root'
})
export class PendingChangesGuard implements CanDeactivate<ThemedSubmissionEditComponent> {

  constructor(
    private modalService: NgbModal,
    private canDeactivateService: SubmissionEditCanDeactivateService
  ) {
  }

  canDeactivate(component?: ThemedSubmissionEditComponent, route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<boolean> {
    return this.canDeactivateService.canDeactivate(route?.params?.id).pipe(
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
      })
    );
  }

}
