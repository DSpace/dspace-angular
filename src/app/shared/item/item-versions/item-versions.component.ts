import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { Version } from '../../../core/shared/version.model';
import { RemoteData } from '../../../core/data/remote-data';
import { BehaviorSubject, combineLatest as observableCombineLatest, Observable, Subject } from 'rxjs';
import { VersionHistory } from '../../../core/shared/version-history.model';
import {
  getAllSucceededRemoteData,
  getAllSucceededRemoteDataPayload, getFirstCompletedRemoteData, getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload,
  getRemoteDataPayload
} from '../../../core/shared/operators';
import { map, startWith, switchMap } from 'rxjs/operators';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { PaginationComponentOptions } from '../../pagination/pagination-component-options.model';
import { VersionHistoryDataService } from '../../../core/data/version-history-data.service';
import { PaginatedSearchOptions } from '../../search/paginated-search-options.model';
import { AlertType } from '../../alert/aletr-type';
import { followLink } from '../../utils/follow-link-config.model';
import { hasValue, hasValueOperator } from '../../empty.util';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { getItemPageRoute } from '../../../item-page/item-page-routing-paths';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemVersionsSummaryModalComponent } from './item-versions-summary-modal/item-versions-summary-modal.component';
import { NotificationsService } from '../../notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-item-versions',
  templateUrl: './item-versions.component.html',
  styleUrls: ['./item-versions.component.scss']
})
/**
 * Component listing all available versions of the history the provided item is a part of
 */
export class ItemVersionsComponent implements OnInit {
  /**
   * The item to display a version history for
   */
  @Input() item: Item;

  /**
   * An option to display the list of versions, even when there aren't any.
   * Instead of the table, an alert will be displayed, notifying the user there are no other versions present
   * for the current item.
   */
  @Input() displayWhenEmpty = false;

  /**
   * Whether or not to display the title
   */
  @Input() displayTitle = true;

  /**
   * Whether or not to display the action buttons
   */
  @Input() displayActions: boolean;

  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  AlertTypeEnum = AlertType;

  /**
   * The item's version
   */
  versionRD$: Observable<RemoteData<Version>>;

  /**
   * The item's full version history
   */
  versionHistoryRD$: Observable<RemoteData<VersionHistory>>;

  /**
   * The version history's list of versions
   */
  versionsRD$: Observable<RemoteData<PaginatedList<Version>>>;

  /**
   * Verify if the list of versions has at least one e-person to display
   * Used to hide the "Editor" column when no e-persons are present to display
   */
  hasEpersons$: Observable<boolean>;

  /**
   * The amount of versions to display per page
   */
  pageSize = 10;

  /**
   * The page options to use for fetching the versions
   * Start at page 1 and always use the set page size
   */
  options = Object.assign(new PaginationComponentOptions(), {
    id: 'ivo',
    currentPage: 1,
    pageSize: this.pageSize
  });

  /**
   * The current page being displayed
   */
  currentPage$ = new BehaviorSubject<number>(1);

  /**
   * The routes to the versions their item pages
   * Key: Item ID
   * Value: Route to item page
   */
  itemPageRoutes$: Observable<{
    [itemId: string]: string
  }>;

  constructor(private versionHistoryService: VersionHistoryDataService,
              private paginationService: PaginationService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private notificationsService: NotificationsService,
              private translateService: TranslateService,
  ) {
  }


  // summaryForm = this.formBuilder.group({summary: 's'});

  onSummarySubmit() { // TODO submit
    console.log('SUBMITTING ' + this.summary);
    this.versionBeingEdited = undefined;
  }

  isAnyBeingEdited(): boolean {
    return this.versionBeingEdited != null;
  }

  isThisBeingEdited(version): boolean {
    return Number(version?.version) === this.versionBeingEdited;
  }

  editVersionSummary(version): void {
    this.summary = version?.summary;
    this.versionBeingEdited = Number(version?.version);
  }

  discardSummaryEdits(): void {
    this.versionBeingEdited = undefined;
  }

  createNewVersion(version) {
    const successMessageKey = 'item.version.create.message.success';
    const failureMessageKey = 'item.version.create.message.failure';
    const activeModal = this.modalService.open(ItemVersionsSummaryModalComponent);
    activeModal.componentInstance.versionNumber = version.version;

    activeModal.result.then((modalResult) => {
      const summary = modalResult;
      version.item.pipe(getFirstSucceededRemoteDataPayload()).subscribe((item) => {

        const itemHref = item._links.self.href;

        // TODO crea versione

        this.versionHistoryService.createVersion(itemHref, summary).pipe(getFirstCompletedRemoteData()).subscribe((postResult) => {
          const newVersion = postResult.payload;
          const newVersionNumber = newVersion.version;
          console.log("SUCCESS " + newVersionNumber);
          console.log('RESPONSE = ' + JSON.stringify(postResult));
          this.notificationsService.success(null, this.translateService.get(successMessageKey, {version: newVersionNumber}));
          this.refreshSubject.next();
        });

        // TODO success

        // error
        this.notificationsService.error(null, this.translateService.get(failureMessageKey));
      });
    }).catch((msg) => {
        this.notificationsService.warning(null, this.translateService.get(failureMessageKey));
      }
    );

  }


  /**
   * Initialize all observables
   */
  ngOnInit(): void {
    if (hasValue(this.item.version)) {
      this.versionRD$ = this.item.version;
      this.versionHistoryRD$ = this.versionRD$.pipe(
        getAllSucceededRemoteData(),
        getRemoteDataPayload(),
        hasValueOperator(),
        switchMap((version: Version) => version.versionhistory)
      );
      const versionHistory$ = this.versionHistoryRD$.pipe(
        getAllSucceededRemoteData(),
        getRemoteDataPayload(),
        hasValueOperator(),
      );
      const currentPagination = this.paginationService.getCurrentPagination(this.options.id, this.options);
      this.versionsRD$ = observableCombineLatest(versionHistory$, currentPagination).pipe(
        switchMap(([versionHistory, options]: [VersionHistory, PaginationComponentOptions]) =>
          this.versionHistoryService.getVersions(versionHistory.id,
            new PaginatedSearchOptions({pagination: Object.assign({}, options, {currentPage: options.currentPage})}),
            true, true, followLink('item'), followLink('eperson')))
      );
      /* TODO fix error and restore refresh
      The response for 'http://localhost:8080/server/api/versioning/versionhistories/1/versions?page=0&size=1'
      has the self link 'http://localhost:8080/server/api/versioning/versionhistories/1/versions?page=0&embed=item&size=1'.
      These don't match. This could mean there's an issue with the REST endpoint
       */
      this.hasEpersons$ = this.versionsRD$.pipe(
        getAllSucceededRemoteData(),
        getRemoteDataPayload(),
        hasValueOperator(),
        map((versions: PaginatedList<Version>) => versions.page.filter((version: Version) => version.eperson !== undefined).length > 0),
        startWith(false)
      );
      this.itemPageRoutes$ = this.versionsRD$.pipe(
        getAllSucceededRemoteDataPayload(),
        switchMap((versions) => observableCombineLatest(...versions.page.map((version) => version.item.pipe(getAllSucceededRemoteDataPayload())))),
        map((versions) => {
          const itemPageRoutes = {};
          versions.forEach((item) => itemPageRoutes[item.uuid] = getItemPageRoute(item));
          return itemPageRoutes;
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.options.id);
  }


}
