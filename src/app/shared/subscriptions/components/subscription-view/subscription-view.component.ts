import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Subscription } from '../../models/subscription.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EPerson } from '../../../../core/eperson/models/eperson.model';

@Component({
  encapsulation: ViewEncapsulation.Emulated,
  selector: '[ds-subscription-view]',
  templateUrl: './subscription-view.component.html',
  styleUrls: ['./subscription-view.component.scss']
})
export class SubscriptionViewComponent implements OnInit {

  @Input('subscriptions') subscriptions : Subscription[];
  @Input('dso') dso: DSpaceObject;
  @Input('eperson') eperson: EPerson;

  /**
   * Reference to NgbModal
   */
  public modalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
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

}
