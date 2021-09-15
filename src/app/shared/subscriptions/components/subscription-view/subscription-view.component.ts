import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from '../../models/subscription.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';

import { take } from 'rxjs/operators';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { hasValue } from '../../../empty.util';
import { ConfirmationModalComponent } from '../../../confirmation-modal/confirmation-modal.component';
import { SubscriptionService } from '../../subscription.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[ds-subscription-view]',
  templateUrl: './subscription-view.component.html',
  styleUrls: ['./subscription-view.component.scss']
})
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
    private subscriptionService: SubscriptionService,
  ) { }


  /**
   * Open modal
   *
   * @param content
   */
  public openSubscription(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  /**
   * Return the prefix of the route to the dso object page ( e.g. "items")
   */
  getPageRoutePrefix(): string {
    let routePrefix;
    switch (this.dso.type.toString()) {
      case 'community':
        routePrefix = '/communities';
        break;
      case 'collection':
        routePrefix = '/collections';
        break;
      case 'item':
        routePrefix = '/items';
        break;
    }
    return routePrefix;
  }

  /**
   * Deletes Subscription, show notification on success/failure & updates list
   * @param subscription Subscription to be deleted
   */
  deleteSubscriptionPopup(subscription: Subscription) {
    if (hasValue(subscription.id)) {
      const modalRef = this.modalService.open(ConfirmationModalComponent);
      modalRef.componentInstance.dso = this.dso;
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
}
