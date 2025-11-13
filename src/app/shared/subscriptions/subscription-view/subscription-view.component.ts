
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { SubscriptionsDataService } from '@dspace/core/data/subscriptions-data.service';
import { getDSORoute } from '@dspace/core/router/utils/dso-route.utils';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { Subscription } from '@dspace/core/shared/subscription.model';
import { hasValue } from '@dspace/shared/utils/empty.util';
import {
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import { BtnDisabledDirective } from '../../btn-disabled.directive';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { ThemedTypeBadgeComponent } from '../../object-collection/shared/badges/type-badge/themed-type-badge.component';
import { SubscriptionModalComponent } from '../subscription-modal/subscription-modal.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[ds-subscription-view]',
  templateUrl: './subscription-view.component.html',
  styleUrls: ['./subscription-view.component.scss'],
  standalone: true,
  imports: [
    BtnDisabledDirective,
    RouterLink,
    ThemedTypeBadgeComponent,
    TranslateModule,
  ],
})
/**
 * Table row representing a subscription that displays all information and action buttons to manage it
 */
export class SubscriptionViewComponent {

  /**
   * Subscription to be rendered
   */
  @Input() subscription: Subscription;

  /**
   * DSpaceObject of the subscription
   */
  @Input() dso: DSpaceObject;

  /**
   * EPerson of the subscription
   */
  @Input() eperson: string;

  /**
   * When an action is made emit a reload event
   */
  @Output() reload = new EventEmitter();

  /**
   * Reference to NgbModal
   */
  public modalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private subscriptionService: SubscriptionsDataService,
    public dsoNameService: DSONameService,
  ) { }

  /**
   * Return the route to the dso object page
   */
  getPageRoute(dso: DSpaceObject): string {
    return getDSORoute(dso);
  }

  /**
   * Deletes Subscription, show notification on success/failure & updates list
   * @param subscription Subscription to be deleted
   */
  deleteSubscriptionPopup(subscription: Subscription) {
    if (hasValue(subscription.id)) {
      const modalRef = this.modalService.open(ConfirmationModalComponent);
      modalRef.componentInstance.name = this.dsoNameService.getName(this.dso);
      modalRef.componentInstance.headerLabel = 'confirmation-modal.delete-subscription.header';
      modalRef.componentInstance.infoLabel = 'confirmation-modal.delete-subscription.info';
      modalRef.componentInstance.cancelLabel = 'confirmation-modal.delete-subscription.cancel';
      modalRef.componentInstance.confirmLabel = 'confirmation-modal.delete-subscription.confirm';
      modalRef.componentInstance.brandColor = 'danger';
      modalRef.componentInstance.confirmIcon = 'fas fa-trash';
      modalRef.componentInstance.response.pipe(take(1)).subscribe((confirm: boolean) => {
        if (confirm) {
          this.subscriptionService.deleteSubscription(subscription.id).subscribe( (res) => {
            this.reload.emit();
          });
        }
      });
    }
  }

  public openSubscriptionModal() {
    this.modalRef = this.modalService.open(SubscriptionModalComponent);
    this.modalRef.componentInstance.dso = this.dso;
    this.modalRef.componentInstance.subscription = this.subscription;
    this.modalRef.componentInstance.updateSubscription.pipe(take(1)).subscribe((subscription: Subscription) => {
      this.subscription = subscription;
    });

  }
}
