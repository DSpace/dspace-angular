import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { Version } from '../../../core/shared/version.model';
import { RemoteData } from '../../../core/data/remote-data';
import { BehaviorSubject, combineLatest as observableCombineLatest, Observable, Subscription } from 'rxjs';
import { VersionHistory } from '../../../core/shared/version-history.model';
import {
  getAllSucceededRemoteData,
  getAllSucceededRemoteDataPayload,
  getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload,
  getRemoteDataPayload
} from '../../../core/shared/operators';
import { map, startWith, switchMap, take } from 'rxjs/operators';
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
import { ItemVersionsDeleteModalComponent } from './item-versions-delete-modal/item-versions-delete-modal.component';
import { VersionDataService } from '../../../core/data/version-data.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';

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

  subs: Subscription[] = [];

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

  /**
   * Emits when the versionsRD$ must be refreshed.
   */
  refreshSubject = new BehaviorSubject<any>(null);

  /**
   * The number of the version whose summary is currently being edited
   */
  versionBeingEditedNumber: string;

  /**
   * The id of the version whose summary is currently being edited
   */
  versionBeingEditedId: string;

//  itemLink: string; TODO delete

  /**
   * The summary currently being edited
   */
  versionBeingEditedSummary: string;


  /**
   * Cancel the current edit when component is destroyed & unsub all subscriptions
   */
  // @HostListener('document:keydown:enter')
  // onSummarySubmitKeydownEvent(event: KeyboardEvent): void {
  //   event.preventDefault();
  // }


  constructor(private versionHistoryService: VersionHistoryDataService,
              private versionService: VersionDataService,
              private itemService: ItemDataService,
              private paginationService: PaginationService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private notificationsService: NotificationsService,
              private translateService: TranslateService,
              private cacheService: ObjectCacheService,
  ) {
  }


  isAnyBeingEdited(): boolean {
    return this.versionBeingEditedNumber != null;
  }

  isThisBeingEdited(version): boolean {
    return version?.version === this.versionBeingEditedNumber;
  }

  editVersionSummary(version): void {
    this.versionBeingEditedSummary = version?.summary;
    this.versionBeingEditedNumber = version?.version;
    this.versionBeingEditedId = version?.id;
  }

  discardSummaryEdits(): void {
    this.versionBeingEditedSummary = undefined;
    this.versionBeingEditedNumber = undefined;
    this.versionBeingEditedId = undefined;
  }

  onSummarySubmit() {

    const successMessageKey = 'item.version.edit.notification.success';
    const failureMessageKey = 'item.version.edit.notification.failure';

    const newSummary = this.versionBeingEditedSummary ?? '';

    // TODO submit

    this.versionService.findById(this.versionBeingEditedId).pipe(getFirstSucceededRemoteData()).subscribe(
      (findRes) => {
        const updatedVersion =
          Object.assign({}, findRes.payload, {
            summary: this.versionBeingEditedSummary,
          });
        this.versionService.update(updatedVersion).pipe(take(1)).subscribe(
          (updateRes) => {
            // TODO check
            if (updateRes.hasSucceeded) {
              this.notificationsService.success(null, this.translateService.get(successMessageKey, {'version': this.versionBeingEditedNumber}));
            } else {
              this.notificationsService.warning(null, this.translateService.get(failureMessageKey, {'version': this.versionBeingEditedNumber}));
            }
          }
        );
      }
    );

    console.log('SUBMITTING ' + this.versionBeingEditedSummary);
    this.versionBeingEditedNumber = undefined;
  }


  deleteVersion(version) {
    const successMessageKey = 'item.version.delete.notification.success';
    const failureMessageKey = 'item.version.delete.notification.failure';
    const versionNumber = version.version;

    // Open modal
    const activeModal = this.modalService.open(ItemVersionsDeleteModalComponent);
    activeModal.componentInstance.versionNumber = version.version;

    // On modal submit/dismiss
    activeModal.result.then((modalResult) => {
      // TODO delete version
      // TODO non usare due subscriptions innestate ma uno switchmap
      version.item.pipe(getFirstSucceededRemoteDataPayload()).subscribe((getItemRes) => {
        this.itemService.delete(getItemRes.id).pipe(take(1)).subscribe( // TODO provare con getfirstcompletedremotedata
          (deleteItemRes) => {
            console.log(JSON.stringify(deleteItemRes));
            if (deleteItemRes.hasSucceeded) {
              this.notificationsService.success(null, this.translateService.get(successMessageKey, {'version': versionNumber}));
            } else {
              this.notificationsService.warning(null, this.translateService.get(failureMessageKey, {'version': versionNumber}));
            }
          }
        );
      });
    }).catch(() => {
        this.notificationsService.warning(null, this.translateService.get(failureMessageKey, {'version': versionNumber}));
      }
    );
  }


  // TODO aggiungere create anche alla pagina dell'item (spostare in file esterno?)

  createNewVersion(version) {
    const successMessageKey = 'item.version.create.notification.success';
    const failureMessageKey = 'item.version.create.notification.failure';
    const versionNumber = version.version;

    // Open modal
    const activeModal = this.modalService.open(ItemVersionsSummaryModalComponent);
    activeModal.componentInstance.versionNumber = versionNumber;

    // On modal submit/dismiss
    activeModal.result.then((modalResult) => {
      const summary = modalResult;
      version.item.pipe(getFirstSucceededRemoteDataPayload()).subscribe((item) => {

        const itemHref = item._links.self.href;

        this.versionHistoryService.createVersion(itemHref, summary).pipe(take(1)).subscribe((postResult) => {
          if (postResult.hasSucceeded) {
            const newVersionNumber = postResult.payload.version;
            this.notificationsService.success(null, this.translateService.get(successMessageKey, {version: newVersionNumber}));
            this.refreshSubject.next(null);
          } else {
            this.notificationsService.error(null, this.translateService.get(failureMessageKey));
          }
        });
      });
    }).catch(() => {
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
      this.versionsRD$ = observableCombineLatest([versionHistory$, currentPagination]).pipe(
        switchMap(([versionHistory, options]: [VersionHistory, PaginationComponentOptions]) => {
          return this.versionHistoryService.getVersions(versionHistory.id,
            new PaginatedSearchOptions({pagination: Object.assign({}, options, {currentPage: options.currentPage})}),
            true, true, followLink('item'), followLink('eperson'));
        })
      );
      // TODO comment refresh
      this.subs.push(this.refreshSubject.pipe(switchMap(() => {
        return observableCombineLatest([versionHistory$, currentPagination]).pipe(
          take(1),
          switchMap(([versionHistory, options]: [VersionHistory, PaginationComponentOptions]) => {
            return this.versionHistoryService.getVersions(versionHistory.id,
              new PaginatedSearchOptions({pagination: Object.assign({}, options, {currentPage: options.currentPage})}),
              false, true, followLink('item'), followLink('eperson'));
          })
        );
      })).subscribe());


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
    this.cleanupSubscribes();
    this.paginationService.clearPagination(this.options.id);
  }

  /**
   * Unsub all subscriptions
   */
  cleanupSubscribes() {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

}
