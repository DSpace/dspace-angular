import { Component, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { CrisLayoutBox } from '../../decorators/cris-layout-box.decorator';
import { CrisLayoutBoxModelComponent as CrisLayoutBoxObj } from '../../models/cris-layout-box.model';
import { LayoutPage } from '../../enums/layout-page.enum';
import { LayoutTab } from '../../enums/layout-tab.enum';
import { LayoutBox } from '../../enums/layout-box.enum';
import { OrcidQueueService } from '../../../core/orcid/orcid-queue.service';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { OrcidQueue } from '../../../core/orcid/model/orcid-queue.model';
import { hasValue } from '../../../shared/empty.util';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { OrcidHistoryService } from '../../../core/orcid/orcid-history.service';
import { OrcidHistory } from '../../../core/orcid/model/orcid-history.model';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { getFinishedRemoteData, getFirstCompletedRemoteData } from '../../../core/shared/operators';

@Component({
  selector: 'ds-orcid-sync-queue.component',
  templateUrl: './orcid-sync-queue.component.html'
})
@CrisLayoutBox(LayoutPage.DEFAULT, LayoutTab.ORCID, LayoutBox.ORCID_SYNC_QUEUE)
export class OrcidSyncQueueComponent extends CrisLayoutBoxObj implements OnInit {

  /**
   * Pagination config used to display the list
   */
  public paginationOptions: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'oqp',
    pageSize: 5
  });

  /**
   * A boolean representing if results are loading
   */
  public processing$ = new BehaviorSubject<boolean>(false);

  /**
   * A list of orcid queue records
   */
  private list$: BehaviorSubject<RemoteData<PaginatedList<OrcidQueue>>> = new BehaviorSubject<RemoteData<PaginatedList<OrcidQueue>>>({} as any);

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  constructor(private orcidQueueService: OrcidQueueService,
              private translateService: TranslateService,
              private notificationsService: NotificationsService,
              private orcidHistoryService: OrcidHistoryService,
              private paginationService: PaginationService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.updateList();
  }

  updateList() {
    this.subs.push(
      this.paginationService.getCurrentPagination(this.paginationOptions.id, this.paginationOptions).pipe(
        tap(() => this.processing$.next(true)),
        switchMap((config: PaginationComponentOptions) => this.orcidQueueService.searchByOwnerId(this.item.id, config)),
        getFirstCompletedRemoteData()
      ).subscribe((result: RemoteData<PaginatedList<OrcidQueue>>) => {
        this.processing$.next(false);
        this.list$.next(result);
        this.orcidQueueService.clearFindByOwnerRequests();
      })
    );
  }

  /**
   * Return the list of orcid queue records
   */
  getList(): Observable<RemoteData<PaginatedList<OrcidQueue>>> {
    return this.list$.asObservable();
  }

  getIconClass(orcidQueue: OrcidQueue): string {
    if (!orcidQueue.entityType) {
      return 'fa fa-book';
    }
    switch (orcidQueue.entityType) {
      case 'Publication':
        return 'fa fa-book';
      case 'Person':
        return 'fa fa-user';
      case 'Project':
        return 'fa fa-folder';
      default:
        return 'fa fa-book';
    }
  }

  deleteEntry(orcidQueue: OrcidQueue) {
    this.processing$.next(true);
    this.subs.push(this.orcidQueueService.deleteById(orcidQueue.id).pipe(
      getFinishedRemoteData()
    ).subscribe((remoteData) => {
      this.processing$.next(false);
      if (remoteData.isSuccess) {
        this.notificationsService.success(this.translateService.get('person.page.orcid.sync-queue.delete.success'));
        this.updateList();
      } else {
        this.notificationsService.error(this.translateService.get('person.page.orcid.sync-queue.delete.error'));
      }
    }));
  }

  send( orcidQueue: OrcidQueue ) {
    this.processing$.next(true);
    this.subs.push(this.orcidHistoryService.sendToORCID(orcidQueue).pipe(
      getFinishedRemoteData()
    ).subscribe((remoteData) => {
      this.processing$.next(false);
      if (remoteData.isSuccess) {

        const orcidHistory: OrcidHistory = remoteData.payload;
        switch (orcidHistory.status) {
          case 200:
          case 201:
            this.notificationsService.success(this.translateService.get('person.page.orcid.sync-queue.send.success'));
            this.updateList();
            break;
          case 404:
            this.notificationsService.error(this.translateService.get('person.page.orcid.sync-queue.send.not-found-error'));
            break;
          case 409:
            this.notificationsService.error(this.translateService.get('person.page.orcid.sync-queue.send.conflict-error'));
            break;
          default:
            this.notificationsService.error(this.translateService.get('person.page.orcid.sync-queue.send.error'));
        }

      } else {
        this.notificationsService.error(this.translateService.get('person.page.orcid.sync-queue.send.error'));
      }
    }));
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.list$ = null;
    this.subs.filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
}
