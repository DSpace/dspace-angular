import { Component, OnInit } from '@angular/core';
import { AdminNotifySearchResult } from '../models/admin-notify-message-search-result.model';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { Context } from '../../../core/shared/context.model';
import { AdminNotifyMessage, QueueStatusMap } from '../models/admin-notify-message.model';
import {
  tabulatableObjectsComponent
} from '../../../shared/object-collection/shared/tabulatable-objects/tabulatable-objects.decorator';
import {
  TabulatableResultListElementsComponent
} from '../../../shared/object-list/search-result-list-element/tabulatable-search-result/tabulatable-result-list-elements.component';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminNotifyDetailModalComponent } from '../admin-notify-detail-modal/admin-notify-detail-modal.component';
import { objects } from "../../../shared/search/search-results/search-results.component.spec";

@tabulatableObjectsComponent(PaginatedList<AdminNotifySearchResult>, ViewMode.Table, Context.CoarNotify)
@Component({
  selector: 'ds-admin-notify-search-result',
  templateUrl: './admin-notify-search-result.component.html',
  styleUrls: ['./admin-notify-search-result.component.scss']
})
export class AdminNotifySearchResultComponent  extends TabulatableResultListElementsComponent<PaginatedList<AdminNotifySearchResult>, AdminNotifySearchResult> implements OnInit{
    public notifyMessages: AdminNotifyMessage[];
    public reprocessStatus = QueueStatusMap.QUEUE_STATUS_QUEUED_FOR_RETRY;

    constructor(private modalService: NgbModal) {
      super();
    }

  /**
   * Map messages on init for readable representation
   */
  ngOnInit() {
    console.log(this.objects.page.splice(0,2))
    this.notifyMessages = this.objects.page.map(object => {
      const indexableObject = object.indexableObject;
      indexableObject.coarNotifyType = indexableObject.coarNotifyType.split(':')[1];
      indexableObject.queueStatusLabel = QueueStatusMap[indexableObject.queueStatusLabel];
      return indexableObject;
    });
  }

    /**
   * Open modal for details visualization
   * @param message the message to be displayed
   */
  openDetailModal(message: AdminNotifyMessage) {
    const modalRef = this.modalService.open(AdminNotifyDetailModalComponent);
    const messageKeys = Object.keys(message);
    const keysToRead = [];
    messageKeys.forEach((key) => {
      if (typeof message[key] !== 'object') {
        keysToRead.push(key);
      }
    });
    modalRef.componentInstance.notifyMessage = message;
    modalRef.componentInstance.notifyMessageKeys = keysToRead;
  }
}
