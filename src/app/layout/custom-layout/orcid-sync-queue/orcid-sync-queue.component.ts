import { Component, HostBinding, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ResearcherProfileService } from '../../../core/profile/researcher-profile.service';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { OrcidHistory } from '../../../core/orcid/model/orcid-history.model';
import { OrcidQueue } from '../../../core/orcid/model/orcid-queue.model';
import { OrcidHistoryService } from '../../../core/orcid/orcid-history.service';
import { OrcidQueueService } from '../../../core/orcid/orcid-queue.service';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { getFinishedRemoteData, getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { hasValue } from '../../../shared/empty.util';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { CrisLayoutBox } from '../../decorators/cris-layout-box.decorator';
import { LayoutBox } from '../../enums/layout-box.enum';
import { LayoutPage } from '../../enums/layout-page.enum';
import { LayoutTab } from '../../enums/layout-tab.enum';
import { CrisLayoutBoxModelComponent as CrisLayoutBoxObj } from '../../models/cris-layout-box.model';


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

  /**
   * Variable to understand if the next box clear value
   */
  nextBoxClear = true;

  /**
   * Dynamic styling of the component host selector
   */
  @HostBinding('style.flex') flex = '0 0 100%';

  /**
   * Dynamic styling of the component host selector
   */
  @HostBinding('style.marginRight') margin = '0px';


  constructor(private orcidQueueService: OrcidQueueService,
              protected translateService: TranslateService,
              private notificationsService: NotificationsService,
              private orcidHistoryService: OrcidHistoryService,
              private paginationService: PaginationService,
              private researcherProfileService: ResearcherProfileService) {
    super(translateService);
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
    if (!orcidQueue.recordType) {
      return 'fa fa-user';
    }
    switch (orcidQueue.recordType.toLowerCase()) {
      case 'publication':
        return 'fa fa-book';
      case 'funding':
        return 'fa fa-wallet';
      case 'education':
        return 'fa fa-school';
      case 'affiliation':
        return 'fa fa-university';
      case 'country':
        return 'fas fa-globe-europe';
      case 'external_ids':
      case 'researcher_urls':
        return 'fas fa-external-link-alt';
      default:
        return 'fa fa-user';
    }
  }

  getIconTooltip(orcidQueue: OrcidQueue): string {
    if (!orcidQueue.recordType) {
      return '';
    }

    return 'person.page.orcid.sync-queue.tooltip.' + orcidQueue.recordType.toLowerCase();
  }

  getOperationBadgeClass(orcidQueue: OrcidQueue): string {

    if (!orcidQueue.operation) {
      return '';
    }

    switch (orcidQueue.operation.toLowerCase()) {
      case 'insert':
        return 'badge badge-pill badge-success';
      case 'update':
        return 'badge badge-pill badge-primary';
      case 'delete':
        return 'badge badge-pill badge-danger';
      default:
        return '';
    }
  }

  getOperationTooltip(orcidQueue: OrcidQueue): string {
    if (!orcidQueue.operation) {
      return '';
    }

    return 'person.page.orcid.sync-queue.tooltip.' + orcidQueue.operation.toLowerCase();
  }

  getOperationClass(orcidQueue: OrcidQueue): string {

    if (!orcidQueue.operation) {
      return '';
    }

    switch (orcidQueue.operation.toLowerCase()) {
      case 'insert':
        return 'fas fa-plus';
      case 'update':
        return 'fas fa-edit';
      case 'delete':
        return 'fas fa-trash-alt';
      default:
        return '';
    }
  }

  discardEntry(orcidQueue: OrcidQueue) {
    this.processing$.next(true);
    this.subs.push(this.orcidQueueService.deleteById(orcidQueue.id).pipe(
      getFinishedRemoteData()
    ).subscribe((remoteData) => {
      this.processing$.next(false);
      if (remoteData.isSuccess) {
        this.notificationsService.success(this.translateService.get('person.page.orcid.sync-queue.discard.success'));
        this.updateList();
      } else {
        this.notificationsService.error(this.translateService.get('person.page.orcid.sync-queue.discard.error'));
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
        this.handleOrcidHistoryRecordCreation(remoteData.payload);
      } else if (remoteData.statusCode === 422) {
        this.handleValidationErrors(remoteData);
      } else {
        this.notificationsService.error(this.translateService.get('person.page.orcid.sync-queue.send.error'));
      }
    }));
  }

  handleOrcidHistoryRecordCreation(orcidHistory: OrcidHistory) {
    switch (orcidHistory.status) {
      case 200:
      case 201:
      case 204:
        this.notificationsService.success(this.translateService.get('person.page.orcid.sync-queue.send.success'));
        this.updateList();
        break;
      case 400:
        this.notificationsService.error(this.translateService.get('person.page.orcid.sync-queue.send.bad-request-error'), null, { timeOut: -1 });
        break;
      case 401:
        combineLatest([
          this.translateService.get('person.page.orcid.sync-queue.send.unauthorized-error.title'),
          this.getUnauthorizedErrorContent()],
        ).subscribe(([title, content]) => {
          this.notificationsService.error(title, content, { timeOut: -1}, true);
        });
        break;
      case 404:
        this.notificationsService.warning(this.translateService.get('person.page.orcid.sync-queue.send.not-found-warning'));
        break;
      case 409:
        this.notificationsService.error(this.translateService.get('person.page.orcid.sync-queue.send.conflict-error'), null, { timeOut: -1 });
        break;
      default:
        this.notificationsService.error(this.translateService.get('person.page.orcid.sync-queue.send.error'), null, { timeOut: -1 });
    }
  }

  handleValidationErrors(remoteData: RemoteData<OrcidHistory>) {
    const translations = [this.translateService.get('person.page.orcid.sync-queue.send.validation-error')];
    const errorMessage = remoteData.errorMessage;
    if (errorMessage && errorMessage.indexOf('Error codes:') > 0) {
      errorMessage.substring(errorMessage.indexOf(':') + 1).trim().split(',')
        .forEach((error) => translations.push(this.translateService.get('person.page.orcid.sync-queue.send.validation-error.' + error)));
    }
    combineLatest(translations).subscribe((messages) => {
      const title = messages.shift();
      const content = '<ul>' + messages.map((message) => '<li>' + message + '</li>').join('') + '</ul>';
      this.notificationsService.error(title, content, { timeOut: -1 }, true);
    });
  }

  private getUnauthorizedErrorContent(): Observable<string> {
    return this.researcherProfileService.getOrcidAuthorizeUrl(this.item).pipe(
      switchMap((authorizeUrl) => this.translateService.get('person.page.orcid.sync-queue.send.unauthorized-error.content', { orcid : authorizeUrl}))
    );
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.list$ = null;
    this.subs.filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

  isProfileRecord(orcidQueue: OrcidQueue): boolean {
    return orcidQueue.recordType !== 'Publication' && orcidQueue.recordType !== 'Project';
  }
}
