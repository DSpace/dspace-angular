import {
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { getDSORoute } from 'src/app/app-routing-paths';

import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { hasValue } from '../../empty.util';
import { ThemedTypeBadgeComponent } from '../../object-collection/shared/badges/type-badge/themed-type-badge.component';
import { Subscription } from '../models/subscription.model';
import { SubscriptionModalComponent } from '../subscription-modal/subscription-modal.component';
import { SubscriptionsDataService } from '../subscriptions-data.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[ds-subscription-view]',
  templateUrl: './subscription-view.component.html',
  styleUrls: ['./subscription-view.component.scss'],
  standalone: true,
  imports: [NgIf, ThemedTypeBadgeComponent, RouterLink, NgFor, TranslateModule],
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
