import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from '../../models/subscription.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-subscription-view',
  templateUrl: './subscription-view.component.html',
  styleUrls: ['./subscription-view.component.scss']
})
export class SubscriptionViewComponent implements OnInit {

  @Input('type') type : string;
  @Input('subscription') subscription : Subscription;
  @Input('dso') dso: DSpaceObject;

  /**
   * Reference to NgbModal
   */
  public modalRef: NgbModalRef;

  eperson = '123123123123';
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
