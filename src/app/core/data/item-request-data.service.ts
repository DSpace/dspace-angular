import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, find, map } from 'rxjs/operators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { RemoteData } from './remote-data';
import { PostRequest } from './request.models';
import { RequestService } from './request.service';
import { ItemRequest } from '../shared/item-request.model';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { DataService } from './data.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';

/**
 * A service responsible for fetching/sending data from/to the REST API on the bitstreamformats endpoint
 */
@Injectable(
  {
    providedIn: 'root',
  }
)
export class ItemRequestDataService extends DataService<ItemRequest> {

  protected linkPath = 'itemrequests';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<ItemRequest>,
  ) {
    super();
  }

  getItemRequestEndpoint(): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }

  getFindItemRequestEndpoint(requestID: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((href: string) => `${href}/${requestID}`));
  }

  requestACopy(itemRequest: ItemRequest): Observable<RemoteData<ItemRequest>> {
    const requestId = this.requestService.generateRequestId();

    const href$ = this.getItemRequestEndpoint();

    href$.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        const request = new PostRequest(requestId, href, itemRequest);
        this.requestService.send(request);
      })
    ).subscribe();

    return this.rdbService.buildFromRequestUUID<ItemRequest>(requestId).pipe(
      getFirstCompletedRemoteData()
    );
  }

}
