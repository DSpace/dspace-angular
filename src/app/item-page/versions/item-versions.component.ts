import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Item } from '../../core/shared/item.model';
import { Version } from '../../core/shared/version.model';
import { RemoteData } from '../../core/data/remote-data';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import { VersionHistory } from '../../core/shared/version-history.model';
import {
  getAllSucceededRemoteData,
  getAllSucceededRemoteDataPayload,
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload, getFirstSucceededRemoteListPayload,
  getRemoteDataPayload
} from '../../core/shared/operators';
import { map, mergeMap, startWith, switchMap, take, tap } from 'rxjs/operators';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { VersionHistoryDataService } from '../../core/data/version-history-data.service';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { AlertType } from '../../shared/alert/alert-type';
import { followLink } from '../../shared/utils/follow-link-config.model';
import {hasValue, hasValueOperator, isNotEmpty, isNotNull} from '../../shared/empty.util';
import { PaginationService } from '../../core/pagination/pagination.service';
import {
  getItemEditVersionhistoryRoute,
  getItemPageRoute,
  getItemVersionRoute
} from '../item-page-routing-paths';
import { UntypedFormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemVersionsSummaryModalComponent } from './item-versions-summary-modal/item-versions-summary-modal.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { ItemVersionsDeleteModalComponent } from './item-versions-delete-modal/item-versions-delete-modal.component';
import { VersionDataService } from '../../core/data/version-data.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { Router } from '@angular/router';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { ItemVersionsSharedService } from './item-versions-shared.service';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import isEqual from 'lodash/isEqual';
import { RequestParam } from '../../core/cache/models/request-param.model';
import { FindListOptions } from '../../core/data/find-list-options.model';
import {WorkspaceItem} from '../../core/submission/models/workspaceitem.model';
import {WorkspaceitemDataService} from '../../core/submission/workspaceitem-data.service';
import {WorkflowItemDataService} from '../../core/submission/workflowitem-data.service';
import {ConfigurationDataService} from '../../core/data/configuration-data.service';

@Component({
  selector: 'ds-item-versions',
  templateUrl: './item-versions.component.html',
  styleUrls: ['./item-versions.component.scss']
})

/**
 * Component listing all available versions of the history the provided item is a part of
 */
export class ItemVersionsComponent implements OnDestroy, OnInit {

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
   * The item's full version history (remote data)
   */
  versionHistoryRD$: Observable<RemoteData<VersionHistory>>;

  /**
   * The item's full version history
   */
  versionHistory$: Observable<VersionHistory>;

  /**
   * The version history's list of versions
   */
  versionsRD$: BehaviorSubject<RemoteData<PaginatedList<Version>>> = new BehaviorSubject<RemoteData<PaginatedList<Version>>>(null);

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
  versionBeingEditedNumber: number;

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

  /**
   * Show `Editor` column in the table.
   */
  showSubmitter$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  /**
   * If the version table is empty load the versions from the metadata `dc.relation.replaces` and
   * `dc.relation.isreplacedby`
   */
  versionsFromMetadata: BehaviorSubject<RelationNameHandle[]> = new BehaviorSubject<RelationNameHandle[]>([]);

  /**
   * Loading of the name from the items handles for the items which are stored in the metadata dc.relation.replaces` and
   * `dc.relation.isreplacedby`
   * Names are stored in this dict to avoid endless calling rest API to get the name of the Item.
   * @private
   */
  private nameCache: { [handle: string]: string } = {};

  constructor(private versionHistoryService: VersionHistoryDataService,
              private versionService: VersionDataService,
              private itemService: ItemDataService,
              private paginationService: PaginationService,
              private formBuilder: UntypedFormBuilder,
              private modalService: NgbModal,
              private notificationsService: NotificationsService,
              private translateService: TranslateService,
              private router: Router,
              private itemVersionShared: ItemVersionsSharedService,
              private authorizationService: AuthorizationDataService,
              private workspaceItemDataService: WorkspaceitemDataService,
              private workflowItemDataService: WorkflowItemDataService,
              private configurationService: ConfigurationDataService,
              private dsoNameService: DSONameService
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
  isThisBeingEdited(version: Version): boolean {
    return version?.version === this.versionBeingEditedNumber;
  }

  /**
   * Enables editing for the specified version
   */
  enableVersionEditing(version: Version): void {
    this.versionBeingEditedSummary = version?.summary;
    this.versionBeingEditedNumber = version?.version;
    this.versionBeingEditedId = version?.id;
  }

  /**
   * Disables editing for the specified version and discards all pending changes
   */
  disableVersionEditing(): void {
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

    this.versionService.findById(this.versionBeingEditedId).pipe(
      getFirstSucceededRemoteData(),
      switchMap((findRes: RemoteData<Version>) => {
        const payload = findRes.payload;
        const summary = {summary: this.versionBeingEditedSummary,};
        const updatedVersion = Object.assign({}, payload, summary);
        return this.versionService.update(updatedVersion).pipe(getFirstCompletedRemoteData<Version>());
      }),
    ).subscribe((updatedVersionRD: RemoteData<Version>) => {
        if (updatedVersionRD.hasSucceeded) {
          this.notificationsService.success(null, this.translateService.get(successMessageKey, {'version': this.versionBeingEditedNumber}));
          this.getAllVersions(this.versionHistory$);
        } else {
          this.notificationsService.warning(null, this.translateService.get(failureMessageKey, {'version': this.versionBeingEditedNumber}));
        }
        this.disableVersionEditing();
      }
    );
  }

  /**
   * Delete the item and get the result of the operation
   * @param item
   */
  deleteItemAndGetResult$(item: Item): Observable<boolean> {
    return this.itemService.delete(item.id).pipe(
      getFirstCompletedRemoteData(),
      map((deleteItemRes) => deleteItemRes.hasSucceeded),
      take(1),
    );
  }

  /**
   * Deletes the specified version, notify the success/failure and redirect to latest version
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
    activeModal.componentInstance.response.pipe(take(1)).subscribe((ok) => {
      if (ok) {
        versionItem$.pipe(
          getFirstSucceededRemoteDataPayload<Item>(),
          // Retrieve version history
          mergeMap((item: Item) => combineLatest([
            of(item),
            this.versionHistoryService.getVersionHistoryFromVersion$(version)
          ])),
          // Delete item
          mergeMap(([item, versionHistory]: [Item, VersionHistory]) => combineLatest([
            this.deleteItemAndGetResult$(item),
            of(versionHistory)
          ])),
          // Retrieve new latest version
          mergeMap(([deleteItemResult, versionHistory]: [boolean, VersionHistory]) => combineLatest([
            of(deleteItemResult),
            this.versionHistoryService.getLatestVersionItemFromHistory$(versionHistory).pipe(
              tap(() => {
                this.getAllVersions(of(versionHistory));
              }),
            )
          ])),
        ).subscribe(([deleteHasSucceeded, newLatestVersionItem]: [boolean, Item]) => {
          // Notify operation result and redirect to latest item
          if (deleteHasSucceeded) {
            this.notificationsService.success(null, this.translateService.get(successMessageKey, {'version': versionNumber}));
          } else {
            this.notificationsService.error(null, this.translateService.get(failureMessageKey, {'version': versionNumber}));
          }
          if (redirectToLatest) {
            const path = getItemEditVersionhistoryRoute(newLatestVersionItem);
            this.router.navigateByUrl(path);
          }
        });
      }
    });
  }

  /**
   * Creates a new version starting from the specified one
   * @param version the version from which a new one will be created
   */
  createNewVersion(version: Version) {
    const versionNumber = version.version;

    // Open modal and set current version number
    const activeModal = this.modalService.open(ItemVersionsSummaryModalComponent);
    activeModal.componentInstance.versionNumber = versionNumber;

    // On createVersionEvent emitted create new version and notify
    activeModal.componentInstance.createVersionEvent.pipe(
      mergeMap((summary: string) => combineLatest([
        of(summary),
        version.item.pipe(getFirstSucceededRemoteDataPayload())
      ])),
      mergeMap(([summary, item]: [string, Item]) => this.versionHistoryService.createVersion(item._links.self.href, summary)),
      getFirstCompletedRemoteData(),
      // close model (should be displaying loading/waiting indicator) when version creation failed/succeeded
      tap(() => activeModal.close()),
      // show success/failure notification
      tap((newVersionRD: RemoteData<Version>) => {
        this.itemVersionShared.notifyCreateNewVersion(newVersionRD);
        if (newVersionRD.hasSucceeded) {
          const versionHistory$ = this.versionService.getHistoryFromVersion(version).pipe(
            tap((versionHistory: VersionHistory) => {
              this.itemService.invalidateItemCache(this.item.uuid);
              this.versionHistoryService.invalidateVersionHistoryCache(versionHistory.id);
            }),
          );
          this.getAllVersions(versionHistory$);
        }
      }),
      // get workspace item
      getFirstSucceededRemoteDataPayload<Version>(),
      switchMap((newVersion: Version) => this.itemService.findByHref(newVersion._links.item.href)),
      getFirstSucceededRemoteDataPayload<Item>(),
      switchMap((newVersionItem: Item) => this.workspaceItemDataService.findByItem(newVersionItem.uuid, true, false)),
      getFirstSucceededRemoteDataPayload<WorkspaceItem>(),
    ).subscribe((wsItem) => {
      const wsiId = wsItem.id;
      const route = 'workspaceitems/' + wsiId + '/edit';
      this.router.navigateByUrl(route);
    });
  }

  /**
   * Check is the current user can edit the version summary
   * @param version
   */
  canEditVersion$(version: Version): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.CanEditVersion, version.self);
  }

  /**
   * Show submitter in version history table
   */
  showSubmitter() {

    const includeSubmitter$ = this.configurationService.findByPropertyName('versioning.item.history.include.submitter').pipe(
      getFirstSucceededRemoteDataPayload(),
      map((configurationProperty) => configurationProperty.values[0]),
      startWith(false),
    );

    const isAdmin$ = combineLatest([
      this.authorizationService.isAuthorized(FeatureID.IsCollectionAdmin),
      this.authorizationService.isAuthorized(FeatureID.IsCommunityAdmin),
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
    ]).pipe(
      map(([isCollectionAdmin, isCommunityAdmin, isSiteAdmin]) => {
        return isCollectionAdmin || isCommunityAdmin || isSiteAdmin;
      }),
      take(1),
    );

    const result$ = combineLatest([includeSubmitter$, isAdmin$]).pipe(
      map(([includeSubmitter, isAdmin]) => {
        return includeSubmitter && isAdmin;
      })
    );

    if (isNotNull(this.showSubmitter$.value)) {
      return;
    }

    result$.subscribe(res => {
      this.showSubmitter$.next(res);
    });
  }

  /**
   * Check if the current user can delete the version
   * @param version
   */
  canDeleteVersion$(version: Version): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.CanDeleteVersion, version.self);
  }

  /**
   * Get all versions for the given version history and store them in versionRD$
   * @param versionHistory$
   */
  getAllVersions(versionHistory$: Observable<VersionHistory>): void {
    const currentPagination = this.paginationService.getCurrentPagination(this.options.id, this.options);
    combineLatest([versionHistory$, currentPagination]).pipe(
      switchMap(([versionHistory, options]: [VersionHistory, PaginationComponentOptions]) => {
        return this.versionHistoryService.getVersions(versionHistory.id,
          new PaginatedSearchOptions({pagination: Object.assign({}, options, {currentPage: options.currentPage})}),
          false, true, followLink('item'), followLink('eperson'));
      }),
      getFirstCompletedRemoteData(),
    ).subscribe((res: RemoteData<PaginatedList<Version>>) => {
      this.versionsRD$.next(res);
    });
  }

  /**
   * Updates the page
   */
  onPageChange() {
    this.getAllVersions(this.versionHistory$);
  }

  /**
   * Get the ID of the workspace item, if present, otherwise return undefined
   * @param versionItem the item for which retrieve the workspace item id
   */
  getWorkspaceId(versionItem): Observable<string> {
    return versionItem.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((item: Item) => item.uuid),
      switchMap((itemUuid: string) => this.workspaceItemDataService.findByItem(itemUuid, true)),
      getFirstCompletedRemoteData<WorkspaceItem>(),
      map((res: RemoteData<WorkspaceItem>) => res?.payload?.id ),
    );
  }

  /**
   * Get the ID of the workflow item, if present, otherwise return undefined
   * @param versionItem the item for which retrieve the workspace item id
   */
  getWorkflowId(versionItem): Observable<string> {
    return versionItem.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((item: Item) => item.uuid),
      switchMap((itemUuid: string) => this.workflowItemDataService.findByItem(itemUuid, true)),
      getFirstCompletedRemoteData<WorkspaceItem>(),
      map((res: RemoteData<WorkspaceItem>) => res?.payload?.id ),
    );
  }

  /**
   * redirect to the edit page of the workspace item
   * @param id$ the id of the workspace item
   */
  editWorkspaceItem(id$: Observable<string>) {
    id$.subscribe((id) => {
      this.router.navigateByUrl('workspaceitems/' + id + '/edit');
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
        switchMap((version: Version) => version.versionhistory),
      );
      this.versionHistory$ = this.versionHistoryRD$.pipe(
        getFirstSucceededRemoteDataPayload(),
        hasValueOperator(),
      );

      this.canCreateVersion$ = this.authorizationService.isAuthorized(FeatureID.CanCreateVersion, this.item.self);

      // If there is a draft item in the version history the 'Create version' button is disabled and a different tooltip message is shown
      this.hasDraftVersion$ = this.versionHistoryRD$.pipe(
        getFirstSucceededRemoteDataPayload(),
        map((res) => Boolean(res?.draftVersion)),
      );

      this.createVersionTitle$ = this.hasDraftVersion$.pipe(
        take(1),
        switchMap((res) => of(res ? 'item.version.history.table.action.hasDraft' : 'item.version.history.table.action.newVersion'))
      );

      this.getAllVersions(this.versionHistory$);
      this.hasEpersons$ = this.versionsRD$.pipe(
        getAllSucceededRemoteData(),
        getRemoteDataPayload(),
        hasValueOperator(),
        map((versions: PaginatedList<Version>) => versions.page.filter((version: Version) => version.eperson !== undefined).length > 0),
        startWith(false)
      );
      this.itemPageRoutes$ = this.versionsRD$.pipe(
        getAllSucceededRemoteDataPayload(),
        switchMap((versions) => combineLatest(versions.page.map((version) => version.item.pipe(getAllSucceededRemoteDataPayload())))),
        map((versions) => {
          const itemPageRoutes = {};
          versions.forEach((item) => itemPageRoutes[item.uuid] = getItemPageRoute(item));
          return itemPageRoutes;
        })
      );

      this.showSubmitter();
    }
  }

  getItemNameFromVersion(version: Version) {
    return version.item
      .pipe(
        getFirstSucceededRemoteDataPayload(),
        map((item: Item) => this.dsoNameService.getName(item)));
  }

  getItemHandleFromVersion(version: Version) {
    return version.item
      .pipe(
        getFirstSucceededRemoteDataPayload(),
        map((item: Item) => item.firstMetadataValue('dc.identifier.uri')));
  }

  /**
   * Unsub all subscriptions
   */
  cleanupSubscribes() {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  /**
   * The Item from the current version could have linked another versions in the metadata `dc.relation.replaces` and
   * `dc.relation.isreplacedby`. Get all this linked versions and show `name` and `handle` of that Items.
   * @param versions
   */
  gelAllVersions(versions: Version[]) {
    let allVersions: BehaviorSubject<VersionWithRelations[]> = new BehaviorSubject<VersionWithRelations[]>([]);
    // Get item from current version and get all linked versions from the metadata `dc.relation.replaces`
    // and `dc.relation.isreplacedby`
    versions.forEach((version: Version) => {
      // Send request to DSpace API to get item from the version.
      version.item
        .pipe(getFirstSucceededRemoteDataPayload())
        .subscribe((item: Item) => {
          let relationReplaces: RelationNameHandle[] = [];
          // Get all metadatavalues from `dc.relation.replaces`
          for (const metadataValue of item.allMetadataValues('dc.relation.replaces')) {
            const newRelationReplaces: RelationNameHandle = {
              name: '',
              handle: metadataValue
            };
            relationReplaces.push(newRelationReplaces);
          }
          // Store isreplacedby
          let relationIsReplacedBy: RelationNameHandle[] = [];
          const allReplacedBy = [];
          // Get all metadatavalues from `dc.relation.isreplacedby`
          item.allMetadataValues('dc.relation.isreplacedby').forEach((metadataValue: string) => {
            allReplacedBy.push(metadataValue);
            const newRelationIsReplacedBy: RelationNameHandle = {
              name: '',
              handle: metadataValue
            };
            relationIsReplacedBy.push(newRelationIsReplacedBy);
          });
          // Add all linked versions to the VersionWithRelations object.
          const newVersionWithRelations: VersionWithRelations = {
            version: version,
            replaces: relationReplaces,
            isreplacedby: relationIsReplacedBy,
            handle: item.firstMetadataValue('dc.identifier.uri')
          };
          // Ignore handle from the metadata if it is handle of current Item which is fetched from the version.
          if (allReplacedBy.includes(this.item.firstMetadataValue('dc.identifier.uri'))) {
            newVersionWithRelations.isreplacedby = [];
          }
          let updatedArray = allVersions.value;
          updatedArray.push(newVersionWithRelations);
          updatedArray = this.filterVersions(updatedArray);
          allVersions.next(updatedArray);
        });
    });

    return allVersions;
  }

  /**
   * If the VersionsRD$ object is empty - there is not data in the database, but the Item has metadata
   * `dc.relation.replaces` and `dc.relation.isreplacedby` show Item's info from that metadata fields.
   */
  getVersionsFromMetadata(item: Item) {
    let relations = item.allMetadataValues('dc.relation.replaces');
    // Merge two arrays into one
    relations.push(...item.allMetadataValues('dc.relation.isreplacedby'));

    relations.forEach((value: string, index) => {
      const newRelationNameHandle: RelationNameHandle = {
        name: this.getNameFromHandle(value),
        handle: value
      };
      const currentVersionsFromMetadata = this.versionsFromMetadata.value;
      currentVersionsFromMetadata[index] = newRelationNameHandle;
      this.versionsFromMetadata.next(currentVersionsFromMetadata);
    });
    return this.versionsFromMetadata;
  }

  /**
   * Remove duplicities from the replaces and isreplacedby arrays.
   */
  filterVersions(allVersions: VersionWithRelations[]) {
    const filteredVersions: VersionWithRelations[] = [];
    // Filter all versions table: Remove record from the table where the item:
    // 1. has previous version handle the same as in the `dc.relation.replaces`
    // 2. has new version handle the same the as in the `dc.relation.isreplacedby`
    for (const currentVersion of allVersions) {
      const index = allVersions.indexOf(currentVersion);
      let previousVersion: VersionWithRelations;
      let newestVersion: VersionWithRelations;

      if (isNotNull(allVersions?.[index - 1])) {
        newestVersion = allVersions?.[index - 1];
      }
      if (isNotNull(allVersions?.[index + 1])) {
        previousVersion = allVersions?.[index + 1];
      }

      // Process previous versions
      if (isNotEmpty(previousVersion)) {
        const newReplaces = [];
        currentVersion.replaces.forEach((relationNameHandle: RelationNameHandle) => {
          if (isEqual(previousVersion.handle, relationNameHandle.handle)) {
            return;
          }
          newReplaces.push(relationNameHandle);
        });
        currentVersion.replaces = newReplaces;
      }

      // Process newest versions
      if (isNotEmpty(newestVersion)) {
        const newIsReplacedBy = [];
        currentVersion.isreplacedby.forEach((relationNameHandle: RelationNameHandle) => {
          if (isEqual(newestVersion.handle, relationNameHandle.handle)) {
            return;
          }
          newIsReplacedBy.push(relationNameHandle);
        });
        currentVersion.isreplacedby = newIsReplacedBy;
      }
      filteredVersions.push(currentVersion);
    }
    return filteredVersions;
  }

  /**
   * Call rest API to get Item's name following its handle.
   * The names are stored in the dictionary to avoid endless API calling.
   */
  getNameFromHandle(handle) {
    if (!this.nameCache[handle]) {
      // Create params for the request
      const params = [new RequestParam('handle', handle)];
      const paramOptions = Object.assign(new FindListOptions(), {
        searchParams: [...params]
      });

      // Send request and process the async response
      this.itemService
        .searchBy('byHandle', paramOptions, false, true)
        .pipe(
          getFirstSucceededRemoteListPayload())
        .subscribe((itemList: Item[]) => {
          this.nameCache[handle] = this.dsoNameService.getName(itemList?.[0]);
          this.updateVersionsFromMetadata(handle, this.nameCache[handle]);
        });
    }
    return this.nameCache[handle];
  }

  /**
   * Update the name in the `versionsFromMetadata` for the current record with matching handle.
   *
   * @param handle of the record which will be updated
   * @param name of the version record
   */
  updateVersionsFromMetadata(handle: string, name: string) {
    const versionsCopy = this.versionsFromMetadata.value;
    versionsCopy.forEach((versionFromMetadata: RelationNameHandle) => {
      if (!isEqual(versionFromMetadata.handle, handle)) {
        return;
      }
      versionFromMetadata.name = name;
    });
    this.versionsFromMetadata.next(versionsCopy);
  }

  ngOnDestroy(): void {
    this.cleanupSubscribes();
    this.paginationService.clearPagination(this.options.id);
  }

}

/**
 * It is override of the `Version` class. We need to show all replaces and isreplacedby metadata values
 * for the current Version.
 */
export interface VersionWithRelations {
  version: Version;
  handle: string,
  replaces: RelationNameHandle[];
  isreplacedby: RelationNameHandle[];
}

/**
 * Show handle and name of the Item which is fetched from the `dc.relation.replaces` and `dc.relation.isreplacedby`
 * metadata of the current version.
 */
export interface RelationNameHandle {
  name: string,
  handle: string
}
