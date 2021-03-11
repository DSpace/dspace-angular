import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { Version } from '../../../core/shared/version.model';
import { RemoteData } from '../../../core/data/remote-data';
import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { VersionHistory } from '../../../core/shared/version-history.model';
import { getAllSucceededRemoteData, getRemoteDataPayload } from '../../../core/shared/operators';
import { map, startWith, switchMap } from 'rxjs/operators';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { PaginationComponentOptions } from '../../pagination/pagination-component-options.model';
import { VersionHistoryDataService } from '../../../core/data/version-history-data.service';
import { PaginatedSearchOptions } from '../../search/paginated-search-options.model';
import { AlertType } from '../../alert/aletr-type';
import { followLink } from '../../utils/follow-link-config.model';
import { hasValueOperator } from '../../empty.util';
import { PaginationService } from '../../../core/pagination/pagination.service';

@Component({
  selector: 'ds-item-versions',
  templateUrl: './item-versions.component.html'
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
  options = Object.assign(new PaginationComponentOptions(),{
    id: 'ivo',
    currentPage: 1,
    pageSize: this.pageSize
  });

  constructor(private versionHistoryService: VersionHistoryDataService,
              private paginationService: PaginationService
              ) {
  }

  /**
   * Initialize all observables
   */
  ngOnInit(): void {
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
          new PaginatedSearchOptions({pagination: Object.assign({}, options, { currentPage: options.currentPage })}),
          true, true, followLink('item'), followLink('eperson')))
    );
    this.hasEpersons$ = this.versionsRD$.pipe(
      getAllSucceededRemoteData(),
      getRemoteDataPayload(),
      hasValueOperator(),
      map((versions: PaginatedList<Version>) => versions.page.filter((version: Version) => version.eperson !== undefined).length > 0),
      startWith(false)
    );
  }

  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.options.id);
  }


}
