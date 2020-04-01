import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { Version } from '../../../core/shared/version.model';
import { RemoteData } from '../../../core/data/remote-data';
import { Observable } from 'rxjs/internal/Observable';
import { VersionHistory } from '../../../core/shared/version-history.model';
import { getAllSucceededRemoteData, getRemoteDataPayload } from '../../../core/shared/operators';
import { map, startWith, switchMap } from 'rxjs/operators';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { PaginatedList } from '../../../core/data/paginated-list';
import { PaginationComponentOptions } from '../../pagination/pagination-component-options.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { VersionHistoryDataService } from '../../../core/data/version-history-data.service';
import { PaginatedSearchOptions } from '../../search/paginated-search-options.model';
import { AlertType } from '../../alert/aletr-type';
import { followLink } from '../../utils/follow-link-config.model';

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
    id: 'item-versions-options',
    currentPage: 1,
    pageSize: this.pageSize
  });

  /**
   * The current page being displayed
   */
  currentPage$ = new BehaviorSubject<number>(1);

  constructor(private versionHistoryService: VersionHistoryDataService) {
  }

  /**
   * Initialize all observables
   */
  ngOnInit(): void {
    this.versionRD$ = this.item.version;
    this.versionHistoryRD$ = this.versionRD$.pipe(
      getAllSucceededRemoteData(),
      getRemoteDataPayload(),
      switchMap((version: Version) => version.versionhistory)
    );
    const versionHistory$ = this.versionHistoryRD$.pipe(
      getAllSucceededRemoteData(),
      getRemoteDataPayload(),
    );
    this.versionsRD$ = observableCombineLatest(versionHistory$, this.currentPage$).pipe(
      switchMap(([versionHistory, page]: [VersionHistory, number]) =>
        this.versionHistoryService.getVersions(versionHistory.id,
          new PaginatedSearchOptions({pagination: Object.assign({}, this.options, { currentPage: page })}),
          followLink('item'), followLink('eperson')))
    );
    this.hasEpersons$ = this.versionsRD$.pipe(
      getAllSucceededRemoteData(),
      getRemoteDataPayload(),
      map((versions: PaginatedList<Version>) => versions.page.filter((version: Version) => version.eperson !== undefined).length > 0),
      startWith(false)
    );
  }

  /**
   * Update the current page
   * @param page
   */
  switchPage(page: number) {
    this.options.currentPage = page;
    this.currentPage$.next(page);
  }

}
