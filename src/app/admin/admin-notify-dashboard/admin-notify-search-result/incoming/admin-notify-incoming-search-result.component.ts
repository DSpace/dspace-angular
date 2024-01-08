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
import { BehaviorSubject, concatMap, from, Observable, of, scan, switchMap } from "rxjs";
import { RemoteData } from "../../../../core/data/remote-data";
import { LdnService } from "../../../admin-ldn-services/ldn-services-model/ldn-services.model";
import { filter, map, mergeMap, take, tap, toArray } from "rxjs/operators";
import { getAllSucceededRemoteDataPayload } from "../../../../core/shared/operators";
import { ItemDataService } from "../../../../core/data/item-data.service";
import { AdminNotifyMessagesService } from "../../services/admin-notify-messages.service";

@tabulatableObjectsComponent(PaginatedList<AdminNotifySearchResult>, ViewMode.Table, Context.CoarNotifyIncoming)
@Component({
  selector: 'ds-admin-notify-search-result',
  templateUrl: './admin-notify-incoming-search-result.component.html',
  styleUrls: ['./admin-notify-incoming-search-result.component.scss']
})
export class AdminNotifyIncomingSearchResultComponent extends TabulatableResultListElementsComponent<PaginatedList<AdminNotifySearchResult>, AdminNotifySearchResult> implements OnInit{
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
    this.notifyMessages = this.objects?.page.map(object => {
      const indexableObject = object.indexableObject;
      indexableObject.coarNotifyType = indexableObject.coarNotifyType.split(':')[1];
      indexableObject.queueStatusLabel = QueueStatusMap[indexableObject.queueStatusLabel];
      return indexableObject;
    });

    this.notifyMessages$ = from(this.notifyMessages).pipe(
      mergeMap(message => of(message)),
      mergeMap(message =>
        message.origin ? this.ldnServicesService.findById(message.origin.toString()).pipe(
          getAllSucceededRemoteDataPayload(),
          map(detail => ({...message, origin: detail.name}))
        ) : of(message),
      ),
      mergeMap(message =>
        message.context ? this.itemDataService.findById(message.context.toString()).pipe(
          getAllSucceededRemoteDataPayload(),
          map(detail => ({...message, context: detail.name}))
        ) : of(message),
      ),
      scan((acc: any, value: any) => [...acc, value], []),
    )
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

  /**
   * Reprocess message in status QUEUE_STATUS_QUEUED_FOR_RETRY and update results
   * @param message
   */
  reprocessMessage(message: AdminNotifyMessage) {
   // TODO implement reprocess
  }
}
