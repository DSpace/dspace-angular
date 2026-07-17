import { Injectable } from '@angular/core';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import {
  hasNoValue,
  hasValue,
} from '@dspace/shared/utils/empty.util';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { IdentifiableDataService } from '../data/base/identifiable-data.service';
import { SearchDataImpl } from '../data/base/search-data';
import { FindListOptions } from '../data/find-list-options.model';
import { PaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DynamicLayoutBox } from './models/box.model';
import {
  DynamicLayoutCell,
  DynamicLayoutRow,
  DynamicLayoutTab,
} from './models/tab.model';

/**
 * A service responsible for fetching layout tabs from the REST API's `/tabs` endpoint.
 *
 * Provides methods to find tabs by item UUID or entity type, with support for
 * filtering out tabs that contain only minor (secondary) boxes.
 */
@Injectable({ providedIn: 'root' })
export class TabDataService extends IdentifiableDataService<DynamicLayoutTab> {
  protected searchFindByItem = 'findByItem';
  protected searchFindByEntityType = 'findByEntityType';
  private searchData: SearchDataImpl<DynamicLayoutTab>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService) {
    super('tabs', requestService, rdbService, objectCache, halService);

    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  /**
   * It returns the tabs that are available for the specified item. The tabs are sorted by
   * priority ascending. This are filtered based on the permission of the current user and
   * available data. Empty tabs are filter out.
   * @param itemUuid UUID of the Item
   * @param useCachedVersionIfAvailable
   */
  findByItem(
    itemUuid: string, useCachedVersionIfAvailable: boolean, excludeMinors?: boolean,
  ): Observable<RemoteData<PaginatedList<DynamicLayoutTab>>> {
    const options = new FindListOptions();
    options.searchParams = [new RequestParam('uuid', itemUuid)];

    return this.searchData.searchBy(this.searchFindByItem, options, useCachedVersionIfAvailable)
      .pipe(
        map((data) => {
          if (hasValue(data?.payload?.page) && excludeMinors) {
            data.payload.page = this.filterTabWithOnlyMinor(data.payload.page);
          }
          return data;
        }));
  }

  /**
   * Filters out tabs where every box is marked as minor.
   *
   * @param tabs the full list of tabs to filter
   * @returns tabs that contain at least one non-minor box
   */
  filterTabWithOnlyMinor(tabs: DynamicLayoutTab[]): DynamicLayoutTab[] {
    return tabs.filter(tab => !this.hasTabOnlyMinor(tab));
  }

  /**
   * Checks whether all boxes within a tab are minor.
   *
   * @param tab the tab to inspect
   * @returns true if every box in every cell in every row is minor
   */
  hasTabOnlyMinor(tab: DynamicLayoutTab): boolean {
    if (hasNoValue(tab?.rows)) {
      return false;
    }
    return tab.rows.every(row => this.hasRowOnlyMinor(row));
  }

  hasRowOnlyMinor(row: DynamicLayoutRow): boolean {
    if (hasNoValue(row?.cells)) {
      return false;
    }
    return row.cells.every(cell => this.hasCellOnlyMinor(cell));
  }

  hasCellOnlyMinor(cell: DynamicLayoutCell): boolean {
    if (hasNoValue(cell?.boxes)) {
      return false;
    }
    return cell.boxes.every(box => this.isMinor(box));
  }

  isMinor(box: DynamicLayoutBox): boolean {
    return box.minor === true;
  }

  /**
   * It returns the tabs that are available for the items of the specified type.
   * This endpoint is reserved to system administrators
   * @param entityType label of the entity type
   */
  findByEntityType(entityType: string): Observable<RemoteData<PaginatedList<DynamicLayoutTab>>> {
    const options = new FindListOptions();
    options.searchParams = [new RequestParam('type', entityType)];
    return this.searchData.searchBy(this.searchFindByEntityType, options);
  }
}
