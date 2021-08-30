import { Component, OnInit, Input, ViewEncapsulation ,Output, EventEmitter } from '@angular/core';
import { Subscription } from '../../models/subscription.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';

import { take } from 'rxjs/operators';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EPerson } from '../../../../core/eperson/models/eperson.model';
import { hasValue } from '../../../../shared/empty.util';
import { ConfirmationModalComponent } from '../../../../shared/confirmation-modal/confirmation-modal.component';
import { SubscriptionService } from '../../../subscriptions/subscription.service';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';

@Component({
  encapsulation: ViewEncapsulation.Emulated,
  selector: '[ds-subscription-view]',
  templateUrl: './subscription-view.component.html',
  styleUrls: ['./subscription-view.component.scss']
})
export class SubscriptionViewComponent implements OnInit {

  @Input('subscription') subscription : Subscription;
  @Input('dso') dso: DSpaceObject;
  @Input('eperson') eperson: EPerson;

  @Output('reload') reload = new EventEmitter();
  /**
   * Reference to NgbModal
   */
  public modalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private subscriptionService: SubscriptionService,
  ) { }

  ngOnInit(): void {
    console.log(this.dso);
  }

  /**
   * Open modal
   *
   * @param content
   */
  public openSubscription(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  /**
   * Return the prefix of the route to the edit page (before the object's UUID, e.g. "items")
   */
  getPageRoutePrefix(): string {
    let routePrefix;
    switch (this.dso.type.toString()) {
      case "community":
        routePrefix = '/communities';
        break;
      case "collection":
        routePrefix = '/collections';
        break;
      case "item":
        routePrefix = '/items';
        break;
    }
    return routePrefix;
  }

  /**
   * Deletes Subscription, show notification on success/failure & updates list
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
          this.subscriptionService.deleteSubscription(subscription.id).subscribe((res)=>{
            this.reload.emit();
          });
        }
      });
    }
  }
}
