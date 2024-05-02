import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { RemoteData } from '../../../core/data/remote-data';
import { QualityAssuranceEventDataService } from '../../../core/notifications/qa/events/quality-assurance-event-data.service';
import { QualityAssuranceEventObject } from '../../../core/notifications/qa/models/quality-assurance-event.model';
import { Item } from '../../../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { ItemWithdrawnReinstateModalComponent } from '../../correction-suggestion/item-withdrawn-reinstate-modal.component';
import { NotificationsService } from '../../notifications/notifications.service';

export const REQUEST_WITHDRAWN = 'REQUEST/WITHDRAWN';
export const REQUEST_REINSTATE = 'REQUEST/REINSTATE';

@Injectable({
  providedIn: 'root',
})
/**
 * Service for managing the withdrawn/reinstate modal for a DSO.
 */
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
  openCreateWithdrawnReinstateModal(dso: Item, correctionType: 'request-reinstate' | 'request-withdrawn', state: boolean): void {
    const target = dso.id;
    // Open modal
    const activeModal = this.modalService.open(ItemWithdrawnReinstateModalComponent);
    (activeModal.componentInstance as ItemWithdrawnReinstateModalComponent).setWithdraw(state);
    (activeModal.componentInstance as ItemWithdrawnReinstateModalComponent).createQAEvent
      .pipe(
        take(1),
      ).subscribe(
        (reasone) => {
          this.sendQARequest(target, correctionType, reasone);
          activeModal.close();
        },
      );
  }

  /**
   * Sends a quality assurance request.
   *
   * @param target - The target - the item's UUID.
   * @param correctionType - The type of correction.
   * @param reason - The reason for the request.
   * Reloads the current page in order to update the withdrawn/reinstate button.
   * and desplay a notification box.
   */
  sendQARequest(target: string, correctionType: 'request-reinstate' | 'request-withdrawn', reason: string): void {
    this.qaEventDataService.postData(target, correctionType, '', reason)
      .pipe (
        getFirstCompletedRemoteData(),
      )
      .subscribe((res: RemoteData<QualityAssuranceEventObject>) => {
        if (res.hasSucceeded) {
          const message = (correctionType === 'request-withdrawn')
            ? 'correction-type.manage-relation.action.notification.withdrawn'
            : 'correction-type.manage-relation.action.notification.reinstate';

          this.notificationsService.success(this.translateService.get(message));
          this.authorizationService.invalidateAuthorizationsRequestCache();
          this.reloadPage(true);
        } else {
          this.notificationsService.error(this.translateService.get('correction-type.manage-relation.action.notification.error'));
        }
      });
  }

  /**
   * Reloads the current page or navigates to a specified URL.
   * @param self - A boolean indicating whether to reload the current page (true) or navigate to a specified URL (false).
   * @param urlToNavigateTo - The URL to navigate to if `self` is false.
   * skipLocationChange:true means dont update the url to / when navigating
   */
  reloadPage(self: boolean, urlToNavigateTo?: string) {
    const url = self ? this.router.url : urlToNavigateTo;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`/${url}`]);
    });
  }
}

