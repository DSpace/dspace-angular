import { Component, OnInit } from '@angular/core';
import { AdminNotifySearchResult } from '../../models/admin-notify-message-search-result.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { Context } from '../../../../core/shared/context.model';
import { AdminNotifyMessage, QueueStatusMap } from '../../models/admin-notify-message.model';
import {
  tabulatableObjectsComponent
} from '../../../../shared/object-collection/shared/tabulatable-objects/tabulatable-objects.decorator';
import {
  TabulatableResultListElementsComponent
} from '../../../../shared/object-list/search-result-list-element/tabulatable-search-result/tabulatable-result-list-elements.component';
import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminNotifyDetailModalComponent } from '../../admin-notify-detail-modal/admin-notify-detail-modal.component';
import { LdnServicesService } from "../../../admin-ldn-services/ldn-services-data/ldn-services-data.service";
import { from, Observable, of, scan, switchMap } from "rxjs";
import { combineLatest, filter, map, mergeMap } from "rxjs/operators";
import { getAllSucceededRemoteDataPayload } from "../../../../core/shared/operators";
import { ItemDataService } from "../../../../core/data/item-data.service";
import { AdminNotifyMessagesService } from "../../services/admin-notify-messages.service";

@tabulatableObjectsComponent(PaginatedList<AdminNotifySearchResult>, ViewMode.Table, Context.CoarNotifyOutgoing)
@Component({
  selector: 'ds-admin-notify-search-result',
  templateUrl: './admin-notify-outgoing-search-result.component.html',
  styleUrls: ['./admin-notify-outgoing-search-result.component.scss']
})
export class AdminNotifyOutgoingSearchResultComponent extends TabulatableResultListElementsComponent<PaginatedList<AdminNotifySearchResult>, AdminNotifySearchResult> implements OnInit{
  public notifyMessages: AdminNotifyMessage[];
  public notifyMessages$: Observable<AdminNotifyMessage[]>;
  public reprocessStatus = QueueStatusMap.QUEUE_STATUS_QUEUED_FOR_RETRY;

    constructor(private modalService: NgbModal,
                private ldnServicesService: LdnServicesService,
                private itemDataService: ItemDataService,
                private adminNotifyMessagesService: AdminNotifyMessagesService) {
      super();
    }

  /**
   * Map messages on init for readable representation
   */
  ngOnInit() {
    this.mapDetailsToMessages()
  }

    /**
   * Open modal for details visualization
   * @param message the message to be displayed
   */
  openDetailModal(message: AdminNotifyMessage) {
    const modalRef = this.modalService.open(AdminNotifyDetailModalComponent);
    const messageKeys = Object.keys(message);
    modalRef.componentInstance.notifyMessage = message;
    modalRef.componentInstance.notifyMessageKeys = messageKeys;
  }

  /**
   * Reprocess message in status QUEUE_STATUS_QUEUED_FOR_RETRY and update results
   * @param message
   */
  reprocessMessage(message: AdminNotifyMessage) {
    this.adminNotifyMessagesService.findById(message.id).pipe(getAllSucceededRemoteDataPayload()).subscribe(response => {
      console.log(response);
    })
  }


  /**
   * Map readable results to messages
   * @private
   */
  private mapDetailsToMessages() {
    this.notifyMessages = this.objects?.page.map(object => {
      const indexableObject = object.indexableObject;
      indexableObject.coarNotifyType = indexableObject.coarNotifyType.split(':')[1];
      indexableObject.queueStatusLabel = QueueStatusMap[indexableObject.queueStatusLabel];
      return indexableObject;
    });

    this.notifyMessages$ = from(this.notifyMessages).pipe(
      mergeMap(message => of(message)),
      mergeMap(message =>
        message.target ? this.ldnServicesService.findById(message.target.toString()).pipe(
          getAllSucceededRemoteDataPayload(),
          map(detail => ({...message, target: detail.name}))
        ) : of(message),
      ),
      mergeMap(message =>
        message.object ? this.itemDataService.findById(message.object.toString()).pipe(
          getAllSucceededRemoteDataPayload(),
          map(detail => ({...message, object: detail.name}))
        ) : of(message),
      ),
      scan((acc: any, value: any) => [...acc, value], []),
    )
  }
}
