import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
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
import { BehaviorSubject, Subscription } from 'rxjs';
import { AdminNotifyMessagesService } from '../services/admin-notify-messages.service';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-page.component';

@tabulatableObjectsComponent(PaginatedList<AdminNotifySearchResult>, ViewMode.Table, Context.CoarNotify)
@Component({
  selector: 'ds-admin-notify-search-result',
  templateUrl: './admin-notify-search-result.component.html',
  styleUrls: ['./admin-notify-search-result.component.scss'],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})
export class AdminNotifySearchResultComponent extends TabulatableResultListElementsComponent<PaginatedList<AdminNotifySearchResult>, AdminNotifySearchResult> implements OnInit, OnDestroy{
  public messagesSubject$: BehaviorSubject<AdminNotifyMessage[]> = new BehaviorSubject([]);
  public reprocessStatus = QueueStatusMap.QUEUE_STATUS_QUEUED_FOR_RETRY;
  //we check on one type of config to render specific table headers
  public isInbound: boolean;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

    constructor(private modalService: NgbModal,
                private adminNotifyMessagesService: AdminNotifyMessagesService,
                @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService) {
      super();
    }

  /**
   * Map messages on init for readable representation
   */
  ngOnInit() {
    this.mapDetailsToMessages();
    this.subs.push(this.searchConfigService.getCurrentConfiguration('')
      .subscribe(configuration => {
        this.isInbound = configuration === 'NOTIFY.incoming';
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  /**
   * Open modal for details visualization
   * @param message the message to be displayed
   */
  openDetailModal(message: AdminNotifyMessage) {
    const modalRef = this.modalService.open(AdminNotifyDetailModalComponent);
    const messageToOpen = {...message};
    // we delete not necessary or not readable keys
    if (this.isInbound) {
      delete messageToOpen.target;
      delete messageToOpen.object;
    } else {
      delete messageToOpen.context;
      delete messageToOpen.origin;
    }
    delete messageToOpen._links;
    delete messageToOpen.metadata;
    delete messageToOpen.thumbnail;
    delete messageToOpen.item;
    delete messageToOpen.accessStatus;
    delete messageToOpen.queueStatus;

    const messageKeys = Object.keys(messageToOpen);
    modalRef.componentInstance.notifyMessage = messageToOpen;
    modalRef.componentInstance.notifyMessageKeys = messageKeys;
  }

  /**
   * Reprocess message in status QUEUE_STATUS_QUEUED_FOR_RETRY and update results
   * @param message the message to be reprocessed
   */
  reprocessMessage(message: AdminNotifyMessage) {
    this.subs.push(
      this.adminNotifyMessagesService.reprocessMessage(message, this.messagesSubject$)
        .subscribe(response => {
          this.messagesSubject$.next(response);
        }
      )
    );
  }


  /**
   * Map readable results to messages
   * @private
   */
  private mapDetailsToMessages() {
    this.subs.push(this.adminNotifyMessagesService.getDetailedMessages(this.objects?.page.map(pageResult => pageResult.indexableObject))
      .subscribe(response => {
        this.messagesSubject$.next(response);
    }));
  }
}
