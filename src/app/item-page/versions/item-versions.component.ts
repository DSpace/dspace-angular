import {
  AsyncPipe,
  DatePipe,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subscription,
} from 'rxjs';
import {
  map,
  startWith,
  switchMap,
  take,
} from 'rxjs/operators';

import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { VersionDataService } from '../../core/data/version-data.service';
import { VersionHistoryDataService } from '../../core/data/version-history-data.service';
import { PaginationService } from '../../core/pagination/pagination.service';
import { Item } from '../../core/shared/item.model';
import {
  getAllSucceededRemoteData,
  getAllSucceededRemoteDataPayload,
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload,
  getRemoteDataPayload,
} from '../../core/shared/operators';
import { Version } from '../../core/shared/version.model';
import { VersionHistory } from '../../core/shared/version-history.model';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AlertType } from '../../shared/alert/alert-type';
import {
  hasValue,
  hasValueOperator,
} from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { VarDirective } from '../../shared/utils/var.directive';
import { getItemPageRoute } from '../item-page-routing-paths';
import { ItemVersionsRowElementVersionComponent } from './item-versions-row-element-version/item-versions-row-element-version.component';

@Component({
  selector: 'ds-item-versions',
  templateUrl: './item-versions.component.html',
  styleUrls: ['./item-versions.component.scss'],
  standalone: true,
  imports: [VarDirective, NgIf, AlertComponent, PaginationComponent, NgFor, RouterLink, NgClass, FormsModule, AsyncPipe, DatePipe, TranslateModule, ItemVersionsRowElementVersionComponent],
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
   * Show submitter in version history table
   */
  showSubmitter$: Observable<boolean> = this.showSubmitter();

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
    pageSize: this.pageSize,
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

  constructor(private versionHistoryService: VersionHistoryDataService,
              private versionService: VersionDataService,
              private paginationService: PaginationService,
              private notificationsService: NotificationsService,
              private translateService: TranslateService,
              private authorizationService: AuthorizationDataService,
              private configurationService: ConfigurationDataService,
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
   * Applies changes to version currently being edited
   */
  onSummarySubmit() {

    const successMessageKey = 'item.version.edit.notification.success';
    const failureMessageKey = 'item.version.edit.notification.failure';

    this.versionService.findById(this.versionBeingEditedId).pipe(
      getFirstSucceededRemoteData(),
      switchMap((findRes: RemoteData<Version>) => {
        const payload = findRes.payload;
        const summary = { summary: this.versionBeingEditedSummary };
        const updatedVersion = Object.assign({}, payload, summary);
        return this.versionService.update(updatedVersion).pipe(getFirstCompletedRemoteData<Version>());
      }),
    ).subscribe((updatedVersionRD: RemoteData<Version>) => {
      if (updatedVersionRD.hasSucceeded) {
        this.notificationsService.success(null, this.translateService.get(successMessageKey, { 'version': this.versionBeingEditedNumber }));
        this.getAllVersions(this.versionHistory$);
      } else {
        this.notificationsService.warning(null, this.translateService.get(failureMessageKey, { 'version': this.versionBeingEditedNumber }));
      }
      this.disableVersionEditing();
    },
    );
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

    return combineLatest([includeSubmitter$, isAdmin$]).pipe(
      map(([includeSubmitter, isAdmin]) => {
        return includeSubmitter && isAdmin;
      }),
    );

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
          new PaginatedSearchOptions({ pagination: Object.assign({}, options, { currentPage: options.currentPage }) }),
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

      // If there is a draft item in the version history the 'Create version' button is disabled and a different tooltip message is shown
      this.hasDraftVersion$ = this.versionHistoryRD$.pipe(
        getFirstSucceededRemoteDataPayload(),
        map((res) => Boolean(res?.draftVersion)),
      );

      this.getAllVersions(this.versionHistory$);
      this.hasEpersons$ = this.versionsRD$.pipe(
        getAllSucceededRemoteData(),
        getRemoteDataPayload(),
        hasValueOperator(),
        map((versions: PaginatedList<Version>) => versions.page.filter((version: Version) => version.eperson !== undefined).length > 0),
        startWith(false),
      );
      this.itemPageRoutes$ = this.versionsRD$.pipe(
        getAllSucceededRemoteDataPayload(),
        switchMap((versions) => combineLatest(versions.page.map((version) => version.item.pipe(getAllSucceededRemoteDataPayload())))),
        map((versions) => {
          const itemPageRoutes = {};
          versions.forEach((item) => itemPageRoutes[item.uuid] = getItemPageRoute(item));
          return itemPageRoutes;
        }),
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
