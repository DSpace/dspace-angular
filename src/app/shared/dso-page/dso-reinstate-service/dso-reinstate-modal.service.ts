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
import { filter } from 'rxjs/operators';
import { RemoteData } from '../../../core/data/remote-data';
import {
  QualityAssuranceEventObject
} from '../../../core/suggestion-notifications/qa/models/quality-assurance-event.model';


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
   * Open the reinstate modal for the provided dso
   */
  openCreateReinstateModal(dso): void {
    const selfHref = dso._links.self.href;

    const data = 'https://localhost:8080/server/api/config/correctiontypes/reinstateRequest' + '\n' + selfHref;
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
          const message = 'reinstate';
          this.notificationsService.success(this.translateService.get(message));
        } else {
          this.notificationsService.error(this.translateService.get('correction-type.manage-relation.action.notification.error'));
        }
      });
  }

}
