import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { Version } from '../../../core/shared/version.model';
import { RemoteData } from '../../../core/data/remote-data';
import {
  BehaviorSubject,
  combineLatest,
  combineLatest as observableCombineLatest,
  Observable,
  of,
  Subscription
} from 'rxjs';
import { VersionHistory } from '../../../core/shared/version-history.model';
import {
  getAllSucceededRemoteData,
  getAllSucceededRemoteDataPayload,
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload,
  getRemoteDataPayload
} from '../../../core/shared/operators';
import { map, mergeMap, startWith, switchMap, take, tap } from 'rxjs/operators';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { PaginationComponentOptions } from '../../pagination/pagination-component-options.model';
import { VersionHistoryDataService } from '../../../core/data/version-history-data.service';
import { PaginatedSearchOptions } from '../../search/paginated-search-options.model';
import { AlertType } from '../../alert/aletr-type';
import { followLink } from '../../utils/follow-link-config.model';
import { hasValue, hasValueOperator } from '../../empty.util';
import { PaginationService } from '../../../core/pagination/pagination.service';
import {
  getItemEditVersionhistoryRoute,
  getItemPageRoute,
  getItemVersionRoute
} from '../../../item-page/item-page-routing-paths';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemVersionsSummaryModalComponent } from './item-versions-summary-modal/item-versions-summary-modal.component';
import { NotificationsService } from '../../notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { ItemVersionsDeleteModalComponent } from './item-versions-delete-modal/item-versions-delete-modal.component';
import { VersionDataService } from '../../../core/data/version-data.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { Router } from '@angular/router';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { createPaginatedList } from '../../testing/utils.test';
import { createSuccessfulRemoteDataObject } from '../../remote-data.utils';

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
   * Whether or not to display the action buttons (delete/create/edit version)
   */
  @Input() displayActions: boolean;

  /**
   * Array of active subscriptions
   */
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
  versionsRD$: BehaviorSubject<RemoteData<PaginatedList<Version>>> = new BehaviorSubject<RemoteData<PaginatedList<Version>>>(createSuccessfulRemoteDataObject(createPaginatedList()));

  /**
   * Verify if the list of versions has at least one e-person to display
   * Used to hide the "Editor" column when no e-persons are present to display
   */
  hasEpersons$: Observable<boolean>;

  /**
   * Verify if there is an inprogress submission in the version history
   * Used to disable the "Create version" button
   */
  hasDraftVersion$: Observable<boolean>;

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
   * The routes to the versions their item pages
   * Key: Item ID
   * Value: Route to item page
   */
  itemPageRoutes$: Observable<{
    [itemId: string]: string
  }>;

  /**
   * The number of the version whose summary is currently being edited
   */
  versionBeingEditedNumber: string;

  /**
   * The id of the version whose summary is currently being edited
   */
  versionBeingEditedId: string;

  /**
   * The summary currently being edited
   */
  versionBeingEditedSummary: string;

  canCreateVersion$: Observable<boolean>;
  createVersionTitle$: Observable<string>;

  constructor(private versionHistoryService: VersionHistoryDataService,
              private versionService: VersionDataService,
              private itemService: ItemDataService,
              private paginationService: PaginationService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private notificationsService: NotificationsService,
              private translateService: TranslateService,
              private router: Router,
              protected authorizationService: AuthorizationDataService,
  ) {
  }

  /**
   * True when a version is being edited
   * (used to disable buttons for other versions)
   */
  isAnyBeingEdited(): boolean {
    return this.versionBeingEditedNumber != null;
  }

  /**
   * True if the specified version is being edited
   * (used to show input field and to change buttons for specified version)
   */
  isThisBeingEdited(version): boolean {
    return version?.version === this.versionBeingEditedNumber;
  }

  /**
   * Enables editing for the specified version
   */
  enableVersionEditing(version): void {
    this.versionBeingEditedSummary = version?.summary;
    this.versionBeingEditedNumber = version?.version;
    this.versionBeingEditedId = version?.id;
  }

  /**
   * Disables editing for the specified version and discards all pending changes
   */
  disableSummaryEditing(): void {
    this.versionBeingEditedSummary = undefined;
    this.versionBeingEditedNumber = undefined;
    this.versionBeingEditedId = undefined;
  }

  /**
   * Get the route to the specified version
   * @param versionId the ID of the version for which the route will be retrieved
   */
  getVersionRoute(versionId: string) {
    return getItemVersionRoute(versionId);
  }

  /**
   * Applies changes to version currently being edited
   */
  onSummarySubmit() {

    const successMessageKey = 'item.version.edit.notification.success';
    const failureMessageKey = 'item.version.edit.notification.failure';

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
            this.disableSummaryEditing();
          }
        );
      }
    );
  }

  getVersionHistory$(version: Version): Observable<VersionHistory> {
    return this.versionHistoryService.getHistoryIdFromVersion$(version).pipe(
      take(1),
      switchMap((res) => this.versionHistoryService.findById(res)),
      getFirstSucceededRemoteDataPayload(),
    );
  }

  deleteItemAndGetResult$(item: Item): Observable<boolean> {
    return this.itemService.delete(item.id).pipe(
      getFirstCompletedRemoteData(),
      map((deleteItemRes) => deleteItemRes.hasSucceeded),
      take(1),
    );
  }

  getLatestVersionItem$(versionHistory: VersionHistory): Observable<Item> {
    return this.versionHistoryService.getLatestVersionFromHistory$(versionHistory).pipe(
      switchMap((newLatestVersion) => newLatestVersion.item),
      getFirstSucceededRemoteDataPayload(),
    );
  }

  /**
   * Deletes the specified version
   * @param version the version to be deleted
   * @param redirectToLatest force the redirect to the latest version in the history
   */
  deleteVersion(version: Version, redirectToLatest: boolean): void {
    const successMessageKey = 'item.version.delete.notification.success';
    const failureMessageKey = 'item.version.delete.notification.failure';
    const versionNumber = version.version;
    const versionItem$ = version.item;

    // Open modal
    const activeModal = this.modalService.open(ItemVersionsDeleteModalComponent);
    activeModal.componentInstance.versionNumber = version.version;
    activeModal.componentInstance.firstVersion = false;

    // On modal submit/dismiss
    activeModal.result.then(() => {

      // let versionHistoryOuter: VersionHistory;

      versionItem$.pipe(
        getFirstSucceededRemoteDataPayload<Item>(),
        mergeMap((item: Item) => combineLatest([
          // pass item
          of(item),
          // get and return version history
          this.getVersionHistory$(version).pipe(
            // invalidate cache
            tap((versionHistory) => {
              this.versionHistoryService.invalidateVersionHistoryCache(versionHistory.id);
            })
          )
        ])),
        mergeMap(([item, versionHistory]: [Item, VersionHistory]) => combineLatest([
          // delete item and return result
          this.deleteItemAndGetResult$(item),
          // pass version history
          of(versionHistory)
        ])),
        mergeMap(([deleteItemResult, versionHistory]: [boolean, VersionHistory]) => combineLatest([
          // pass result
          of(deleteItemResult),
          // get and return new latest version
          this.getLatestVersionItem$(versionHistory).pipe(
            tap(() => {
              this.getVersionHistory(of(versionHistory));
            }),
          )
        ])),
      ).subscribe(([deleteHasSucceeded, newLatestVersionItem]) => {
        if (deleteHasSucceeded) {
          this.notificationsService.success(null, this.translateService.get(successMessageKey, {'version': versionNumber}));
        } else {
          this.notificationsService.error(null, this.translateService.get(failureMessageKey, {'version': versionNumber}));
        }
        console.log('LATEST VERSION = ' + newLatestVersionItem.uuid);
        if (redirectToLatest) {
          const path = getItemEditVersionhistoryRoute(newLatestVersionItem);
          this.router.navigateByUrl(path);
        }
      });
    });
  }

  /**
   * Creates a new version starting from the specified one
   * @param version the version from which a new one will be created
   */
  createNewVersion(version) {
    const successMessageKey = 'item.version.create.notification.success';
    const failureMessageKey = 'item.version.create.notification.failure';
    const versionNumber = version.version;

    // Open modal
    const activeModal = this.modalService.open(ItemVersionsSummaryModalComponent);
    activeModal.componentInstance.versionNumber = versionNumber;

    // On modal submit/dismiss
    activeModal.result.then((modalResult) => {
      // TODO spostare in metodo
      // TODO recuperare version history e invalidare cache
      // this.versionHistoryService.invalidateVersionHistoryCache(versionHistory.id);
      const summary = modalResult;
      version.item.pipe(getFirstSucceededRemoteDataPayload()).subscribe((item) => {

        const itemHref = item._links.self.href;

        this.versionHistoryService.createVersion(itemHref, summary).pipe(take(1)).subscribe((postResult) => {
          if (postResult.hasSucceeded) {
            const newVersionNumber = postResult.payload.version;
            this.notificationsService.success(null, this.translateService.get(successMessageKey, {version: newVersionNumber}));
            this.getVersionHistory$(version);
          } else {
            this.notificationsService.error(null, this.translateService.get(failureMessageKey));
          }
        });
      });
    });
  }

  // TODO eliminare
  /*hasDraftVersion$(versionItem: Observable<RemoteData<Item>>): Observable<boolean> {
    return versionItem.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((res) => res._links.version.href ),
      switchMap( (res) => this.versionHistoryService.hasDraftVersion$(res))
    );
  }*/

  canEditVersion$(versionItem: Version): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.CanEditVersion, versionItem.self);
  }

  canDeleteVersion$(versionItem: Version): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.CanDeleteVersion, versionItem.self);
  }

  // TODO eliminare (usa item anziché vrsion)
  /*canDeleteVersion$(version: Version) {
    return version.item.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((item) => item.self),
      switchMap((url) => this.authorizationService.isAuthorized(FeatureID.CanDeleteVersion, url)),
      take(1),
    );
  }*/

  getVersionHistory(versionHistory$: Observable<VersionHistory>): void {
    const currentPagination = this.paginationService.getCurrentPagination(this.options.id, this.options);
    observableCombineLatest([versionHistory$, currentPagination]).pipe(
      switchMap(([versionHistory, options]: [VersionHistory, PaginationComponentOptions]) => {
        return this.versionHistoryService.getVersions(versionHistory.id,
          new PaginatedSearchOptions({pagination: Object.assign({}, options, {currentPage: options.currentPage})}),
          true, true, followLink('item'), followLink('eperson'));
      }),
      getFirstCompletedRemoteData(),
    ).subscribe((res) => {
      this.versionsRD$.next(res);
      console.log(res.payload);
    });
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
      this.hasDraftVersion$ = this.versionHistoryRD$.pipe(
        getFirstSucceededRemoteDataPayload(),
        map((res) => res.draftVersion)
      );
      this.canCreateVersion$ = this.authorizationService.isAuthorized(FeatureID.CanCreateVersion, this.item.self);
      this.createVersionTitle$ = this.hasDraftVersion$.pipe(
        take(1),
        switchMap((res) => of(res ? 'item.version.history.table.action.hasDraft' : 'item.version.history.table.action.newVersion'))
      );
      const versionHistory$ = this.versionHistoryRD$.pipe(
        getAllSucceededRemoteData(),
        getRemoteDataPayload(),
        hasValueOperator(),
      );
      this.getVersionHistory(versionHistory$);
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
