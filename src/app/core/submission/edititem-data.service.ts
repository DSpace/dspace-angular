import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { EditItem } from './models/edititem.model';
import { dataService } from '../data/base/data-service.decorator';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { getAllSucceededRemoteDataPayload, getPaginatedListPayload } from '../shared/operators';
import { EditItemMode } from './models/edititem-mode.model';
import { RemoteData } from '../data/remote-data';
import { PaginatedList } from '../data/paginated-list.model';
import { IdentifiableDataService } from '../data/base/identifiable-data.service';
import { SearchDataImpl } from '../data/base/search-data';
import { DeleteDataImpl } from '../data/base/delete-data';
import { FindListOptions } from '../data/find-list-options.model';
import { RequestParam } from '../cache/models/request-param.model';

/**
 * A service that provides methods to make REST requests with edititems endpoint.
 */
@Injectable()
@dataService(EditItem.type)
export class EditItemDataService extends IdentifiableDataService<EditItem> {
  protected linkPath = 'edititems';
  protected searchById = 'findModesById';
  private searchData: SearchDataImpl<EditItemMode>;
  private deleteData: DeleteDataImpl<EditItem>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
  ) {
    super('edititems', requestService, rdbService, objectCache, halService);

    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.deleteData = new DeleteDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive, this.constructIdEndpoint);
  }

  /**
   * Search for editModes from the editItem id
   *
   * @param id                          string id of edit item
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @return Paginated list of edit item modes
   */
  searchEditModesById(id: string, useCachedVersionIfAvailable = true, reRequestOnStale = true): Observable<RemoteData<PaginatedList<EditItemMode>>> {
    const options = new FindListOptions();
    options.searchParams = [
      new RequestParam('uuid', id, false),
    ];
    return this.searchData.searchBy(this.searchById, options, useCachedVersionIfAvailable, reRequestOnStale);
  }

  /**
   * Check if editMode with id is part of the edit item with id
   *
   * @param id string id of edit item
   * @param editModeId string id of edit item
   * @return boolean
   */
  checkEditModeByIdAndType(id: string, editModeId: string) {
    return this.searchEditModesById(id).pipe(
      getAllSucceededRemoteDataPayload(),
      getPaginatedListPayload(),
      map((editModes: EditItemMode[]) => {
        return !!editModes.find(editMode => editMode.uuid === editModeId);
      }));
  }

  /**
   * Invalidate the cache of the editMode
   * @param id
   */
  invalidateItemCache(id: string) {
    this.requestService.setStaleByHrefSubstring('findModesById?uuid=' + id);
  }

}
