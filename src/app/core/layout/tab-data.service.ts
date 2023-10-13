import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { CrisLayoutCell, CrisLayoutRow, CrisLayoutTab } from './models/tab.model';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TAB } from './models/tab.resource-type';
import { dataService } from '../data/base/data-service.decorator';
import { RemoteData } from '../data/remote-data';
import { PaginatedList } from '../data/paginated-list.model';
import { FindListOptions } from '../data/find-list-options.model';
import { RequestParam } from '../cache/models/request-param.model';
import { IdentifiableDataService } from '../data/base/identifiable-data.service';
import { SearchDataImpl } from '../data/base/search-data';
import { map } from 'rxjs/operators';
import { hasNoValue, hasValue } from '../../shared/empty.util';
import { CrisLayoutBox } from './models/box.model';

/**
 * A service responsible for fetching data from the REST API on the tabs endpoint
 */
@Injectable()
@dataService(TAB)
export class TabDataService extends IdentifiableDataService<CrisLayoutTab> {
  protected searchFindByItem = 'findByItem';
  protected searchFindByEntityType = 'findByEntityType';
  private searchData: SearchDataImpl<CrisLayoutTab>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService) {
    super('tabs', requestService, rdbService, objectCache, halService);

    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  /*
    /!**
     * Provide detailed information about a specific tab.
     * @param id id of tab
     *!/
    findById(id: string): Observable<RemoteData<CrisLayoutTab>> {
      return this.dataService.findById(id);
    }*/

  /**
   * It returns the tabs that are available for the specified item. The tabs are sorted by
   * priority ascending. This are filtered based on the permission of the current user and
   * available data. Empty tabs are filter out.
   * @param itemUuid UUID of the Item
   * @param useCachedVersionIfAvailable
   */
  findByItem(
    itemUuid: string, useCachedVersionIfAvailable: boolean, excludeMinors?: boolean
  ): Observable<RemoteData<PaginatedList<CrisLayoutTab>>> {
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
   * @param tabs
   * @returns Tabs which contains non minor element
   */
  filterTabWithOnlyMinor(tabs: CrisLayoutTab[]): CrisLayoutTab[] {
    return tabs.filter(tab => !this.hasTabOnlyMinor(tab));
  }

  /**
   * @param tab  Contains a tab data which has rows, cells and boxes
   * @returns Boolean based on cells has minor or not
   */
  hasTabOnlyMinor(tab: CrisLayoutTab): boolean {
    if (hasNoValue(tab?.rows)) {
      return false;
    }
    return tab.rows.every(row => this.hasRowOnlyMinor(row));
  }

  hasRowOnlyMinor(row: CrisLayoutRow): boolean {
    if (hasNoValue(row?.cells)) {
      return false;
    }
    return row.cells.every(cell => this.hasCellOnlyMinor(cell));
  }

  hasCellOnlyMinor(cell: CrisLayoutCell): boolean {
    if (hasNoValue(cell?.boxes)) {
      return false;
    }
    return cell.boxes.every(box => this.isMinor(box));
  }

  isMinor(box: CrisLayoutBox): boolean {
    return box.minor === true;
  }

  /**
   * It returns the tabs that are available for the items of the specified type.
   * This endpoint is reserved to system administrators
   * @param entityType label of the entity type
   */
  findByEntityType(entityType: string): Observable<RemoteData<PaginatedList<CrisLayoutTab>>> {
    const options = new FindListOptions();
    options.searchParams = [new RequestParam('type', entityType)];
    return this.searchData.searchBy(this.searchFindByEntityType, options);
  }
}
