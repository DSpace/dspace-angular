import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ItemWithdrawnReinstateModalComponent } from '../../correction-suggestion/withdrawn-reinstate-modal.component';
import {
  QualityAssuranceEventDataService
} from '../../../core/suggestion-notifications/qa/events/quality-assurance-event-data.service';
import {
  QualityAssuranceEventObject
} from '../../../core/suggestion-notifications/qa/models/quality-assurance-event.model';
import { RemoteData } from '../../../core/data/remote-data';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../notifications/notifications.service';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DsoWithdrawnModalService {

  constructor(
    protected router: Router,
    protected modalService: NgbModal,
    protected itemService: ItemDataService,
    private notificationsService: NotificationsService,
    private translateService: TranslateService,
    protected qaEventDataService: QualityAssuranceEventDataService
  ) {}

  /**
   * Open the create withdrawn modal for the provided dso
   */
  openCreateWithdrawnModal(dso): void {
    const selfHref = dso._links.self.href;

    const data = 'https://localhost:8080/server/api/config/correctiontypes/withdrawnRequest' + '\n' + selfHref;
    // Open modal
    const activeModal = this.modalService.open(ItemWithdrawnReinstateModalComponent);
    (activeModal.componentInstance as ItemWithdrawnReinstateModalComponent).setDso(dso);
    (activeModal.componentInstance as ItemWithdrawnReinstateModalComponent).submitted$
       .pipe(
          filter((val) => val)
       ).subscribe(
         () => {
           this.sendQARequest(data);
           activeModal.close();
         }
       );
  }

  sendQARequest(data: string): void {
     this.qaEventDataService.postData(data)
      .subscribe((res: RemoteData<QualityAssuranceEventObject>) => {
        if (res.hasSucceeded) {
          const message = 'withdrawn';
          this.notificationsService.success(this.translateService.get(message));
        } else {
          this.notificationsService.error(this.translateService.get('correction-type.manage-relation.action.notification.error'));
        }
      });
  }
}

