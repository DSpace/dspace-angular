import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { IdentifiableDataService } from './base/identifiable-data.service';
import { dataService } from './base/data-service.decorator';
import { NotifyRequestsStatus } from '../../item-page/simple/notify-requests-status/notify-requests-status.model';
import { NOTIFYREQUEST} from '../../item-page/simple/notify-requests-status/notify-requests-status.resource-type';
import { Observable, map, take } from 'rxjs';
import { RemoteData } from './remote-data';
import { GetRequest } from './request.models';


@Injectable()
@dataService(NOTIFYREQUEST)
export class NotifyRequestsStatusDataService extends IdentifiableDataService<NotifyRequestsStatus> {

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected rdb: RemoteDataBuildService,
  ) {
    super('notifyrequests', requestService, rdbService, objectCache, halService);
  }

  /**
   * Retrieves the status of notify requests for a specific item.
   * @param itemUuid The UUID of the item.
   * @returns An Observable that emits the remote data containing the notify requests status.
   */
  getNotifyRequestsStatus(itemUuid: string): Observable<RemoteData<NotifyRequestsStatus>> {
    const href$ = this.getEndpoint().pipe(
      map((url: string) => url + '/' + itemUuid ),
    );

    href$.pipe(take(1)).subscribe((url: string) => {
      const request = new GetRequest(this.requestService.generateRequestId(), url);
      this.requestService.send(request, true);
    });

    return this.rdb.buildFromHref(href$);
  }
}
