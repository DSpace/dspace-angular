import { DataService } from '../data/data.service';
import { EditItem } from './models/edititem.model';
import { Injectable } from '@angular/core';
import { dataService } from '../cache/builders/build-decorators';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core-state.model';
import { map, take } from 'rxjs/operators';
import { getAllSucceededRemoteDataPayload, getPaginatedListPayload } from '../shared/operators';
import { EditItemMode } from './models/edititem-mode.model';
import { Observable } from 'rxjs';
import { RemoteData } from '../data/remote-data';
import { PaginatedList } from '../data/paginated-list.model';
import { GetRequest } from '../data/request.models';

/**
 * A service that provides methods to make REST requests with edititems endpoint.
 */
@Injectable()
@dataService(EditItem.type)
export class EditItemDataService extends DataService<EditItem> {
  protected linkPath = 'edititems';
  protected responseMsToLive = 10 * 1000;

  constructor(
    protected comparator: DSOChangeAnalyzer<EditItem>,
    protected halService: HALEndpointService,
    protected http: HttpClient,
    protected notificationsService: NotificationsService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected store: Store<CoreState>) {
    super();
  }

  /**
   * Search for editModes from the editItem id
   *
   * @param id string id of edit item
   * @param useCachedVersionIfAvailable   If this is true, the request will only be sent if there's
   *                                      no valid cached version. Defaults to false
   * @return Paginated list of edit item modes
   */
  searchEditModesById(id: string, useCachedVersionIfAvailable = true): Observable<RemoteData<PaginatedList<EditItemMode>>> {
    const hrefObs = this.getSearchByHref(
      'findModesById', {
      searchParams: [
        {
          fieldName: 'uuid',
          fieldValue: id
        },
      ]
    });
    hrefObs.pipe(
      take(1)
    ).subscribe((href) => {
      const request = new GetRequest(this.requestService.generateRequestId(), href);
      this.requestService.send(request, useCachedVersionIfAvailable);
    });
    return this.rdbService.buildList<EditItemMode>(hrefObs);
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
