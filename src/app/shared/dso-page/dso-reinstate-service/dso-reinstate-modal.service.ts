import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemDataService } from '../../../core/data/item-data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import {
  QualityAssuranceEventDataService
} from '../../../core/suggestion-notifications/qa/events/quality-assurance-event-data.service';
import { ItemWithdrawnReinstateModalComponent } from '../../correction-suggestion/withdrawn-reinstate-modal.component';
import { take } from 'rxjs/operators';
import { RemoteData } from '../../../core/data/remote-data';
import {
  QualityAssuranceEventObject
} from '../../../core/suggestion-notifications/qa/models/quality-assurance-event.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';


@Injectable({
  providedIn: 'root'
})
export class DsoReinstateModalService {

  constructor(
    protected router: Router,
    protected modalService: NgbModal,
    protected itemService: ItemDataService,
    private notificationsService: NotificationsService,
    private translateService: TranslateService,
    protected qaEventDataService: QualityAssuranceEventDataService
  ) {}

  /**
   * Open the reinstat modal for the provided dso
   */
  openCreateReinstateModal(dso, state: boolean): void {
    const target = dso.id;

    // Open modal
    const activeModal = this.modalService.open(ItemWithdrawnReinstateModalComponent);
    (activeModal.componentInstance as ItemWithdrawnReinstateModalComponent).setReinstate(!state);
    (activeModal.componentInstance as ItemWithdrawnReinstateModalComponent).createQAEvent
      .pipe(
        take(1)
      ).subscribe(
      (reason) => {
        this.sendQARequest(target, reason);
        activeModal.close();
      }
    );
  }

  sendQARequest(target: string, reason: string): void {
    this.qaEventDataService.postData(target, 'request-reinstate','', reason)
      .pipe (
        getFirstCompletedRemoteData()
      )
      .subscribe((res: RemoteData<QualityAssuranceEventObject>) => {
        if (res.hasSucceeded) {
          const message = 'reinstate';
          this.notificationsService.success(this.translateService.get(message));
        } else {
          this.notificationsService.error(this.translateService.get('correction-type.manage-relation.action.notification.error'));
        }
      });
  }

}

