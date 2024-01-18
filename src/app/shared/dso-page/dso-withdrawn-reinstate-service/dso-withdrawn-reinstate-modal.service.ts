import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ItemWithdrawnReinstateModalComponent } from '../../correction-suggestion/withdrawn-reinstate-modal.component';
import {
  QualityAssuranceEventDataService
} from '../../../core/notifications/qa/events/quality-assurance-event-data.service';
import {
  QualityAssuranceEventObject
} from '../../../core/notifications/qa/models/quality-assurance-event.model';
import { RemoteData } from '../../../core/data/remote-data';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../notifications/notifications.service';
import { take } from 'rxjs/operators';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';

@Injectable({
  providedIn: 'root'
})
export class DsoWithdrawnReinstateModalService {

  constructor(
    protected router: Router,
    protected modalService: NgbModal,
    protected itemService: ItemDataService,
    private notificationsService: NotificationsService,
    protected authorizationService: AuthorizationDataService,
    private translateService: TranslateService,
    protected qaEventDataService: QualityAssuranceEventDataService,
  ) {}

  /**
   * Open the create withdrawn modal for the provided dso
   */
  openCreateWithdrawnReinstateModal(dso, correctionType: string, state: boolean): void {
    const target = dso.id;
    // Open modal
    const activeModal = this.modalService.open(ItemWithdrawnReinstateModalComponent);
    (activeModal.componentInstance as ItemWithdrawnReinstateModalComponent).setWithdraw(state);
    (activeModal.componentInstance as ItemWithdrawnReinstateModalComponent).createQAEvent
       .pipe(
          take(1)
       ).subscribe(
         (reasone) => {
           this.sendQARequest(target, correctionType, reasone);
           activeModal.close();
         }
       );
  }

  sendQARequest(target: string, correctionType: string, reason: string): void {
     this.qaEventDataService.postData(target, correctionType, '', reason)
       .pipe (
        getFirstCompletedRemoteData()
       )
      .subscribe((res: RemoteData<QualityAssuranceEventObject>) => {
        if (res.hasSucceeded) {
          const withdrawnMessage = 'Withdrawn request sent.';
          const reinstateMessage = 'Reinstate request sent.';
          const message = (correctionType === 'request-withdrawn') ? withdrawnMessage : reinstateMessage;
          this.notificationsService.success(this.translateService.get(message));
          this.authorizationService.invalidateAuthorizationsRequestCache();
          this.router.navigate([this.router.url]); // refresh page
        } else {
          this.notificationsService.error(this.translateService.get('correction-type.manage-relation.action.notification.error'));
        }
      });
  }
}

