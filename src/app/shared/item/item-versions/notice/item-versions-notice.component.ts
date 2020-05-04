import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { PaginationComponentOptions } from '../../../pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../../search/paginated-search-options.model';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../../../core/data/remote-data';
import { VersionHistory } from '../../../../core/shared/version-history.model';
import { Version } from '../../../../core/shared/version.model';
import { hasValue } from '../../../empty.util';
import { getAllSucceededRemoteData, getRemoteDataPayload } from '../../../../core/shared/operators';
import { filter, map, startWith, switchMap } from 'rxjs/operators';
import { followLink } from '../../../utils/follow-link-config.model';
import { VersionHistoryDataService } from '../../../../core/data/version-history-data.service';
import { AlertType } from '../../../alert/aletr-type';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { getItemPageRoute } from '../../../../+item-page/item-page-routing.module';

@Component({
  selector: 'ds-item-versions-notice',
  templateUrl: './item-versions-notice.component.html'
})
/**
 * Component for displaying a warning notice when the item is not the latest version within its version history
 * The notice contains a link to the latest version's item page
 */
export class ItemVersionsNoticeComponent implements OnInit {
  /**
   * The item to display a version notice for
   */
  @Input() item: Item;

  /**
   * The item's version
   */
  versionRD$: Observable<RemoteData<Version>>;

  /**
   * The item's full version history
   */
  versionHistoryRD$: Observable<RemoteData<VersionHistory>>;

  /**
   * The latest version of the item's version history
   */
  latestVersion$: Observable<Version>;

  /**
   * Is the item's version equal to the latest version from the version history?
   * This will determine whether or not to display a notice linking to the latest version
   */
  isLatestVersion$: Observable<boolean>;

  /**
   * Pagination options to fetch a single version on the first page (this is the latest version in the history)
   */
  latestVersionOptions = Object.assign(new PaginationComponentOptions(),{
    id: 'item-newest-version-options',
    currentPage: 1,
    pageSize: 1
  });

  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;

  constructor(private versionHistoryService: VersionHistoryDataService) {
  }

  /**
   * Initialize the component's observables
   */
  ngOnInit(): void {
    const latestVersionSearch = new PaginatedSearchOptions({pagination: this.latestVersionOptions});
    if (hasValue(this.item.version)) {
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
      this.latestVersion$ = versionHistory$.pipe(
        switchMap((versionHistory: VersionHistory) =>
          this.versionHistoryService.getVersions(versionHistory.id, latestVersionSearch, followLink('item'))),
        getAllSucceededRemoteData(),
        getRemoteDataPayload(),
        filter((versions) => versions.page.length > 0),
        map((versions) => versions.page[0])
      );

      this.isLatestVersion$ = observableCombineLatest(
        this.versionRD$.pipe(getAllSucceededRemoteData(), getRemoteDataPayload()), this.latestVersion$
      ).pipe(
        map(([itemVersion, latestVersion]: [Version, Version]) => itemVersion.id === latestVersion.id),
        startWith(true)
      )
    }
  }

  /**
   * Get the item page url
   * @param item The item for which the url is requested
   */
  getItemPage(item: Item): string {
    if (hasValue(item)) {
      return getItemPageRoute(item.id);
    }
  }
}
