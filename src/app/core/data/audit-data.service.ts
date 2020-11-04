import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Audit } from 'src/app/audit-page/model/audit.model';
import { AUDIT } from 'src/app/audit-page/model/audit.resource-type';
import { map, take } from 'rxjs/operators';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { EPersonDataService } from '../eperson/eperson-data.service';
import { EPerson } from '../eperson/models/eperson.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DataService } from './data.service';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { PaginatedList } from './paginated-list';
import { RemoteData } from './remote-data';
import { FindListOptions } from './request.models';
import { RequestService } from './request.service';

@Injectable()
@dataService(AUDIT)
export class AuditDataService extends DataService<Audit> {
  protected linkPath = 'auditevents';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected ePersonService: EPersonDataService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<Audit>) {
    super();
  }

    /**
   * Get all audit event for the object.
   *
   * @param objectId The objectId id
   * @param options The [[FindListOptions]] object
   * @return Observable<RemoteData<PaginatedList<Audit>>>
   */
  findByObject(objectId: string, options: FindListOptions = {}): Observable<RemoteData<PaginatedList<Audit>>> {
    const searchHref = 'findByObject';
    const optionsWithObject = Object.assign(new FindListOptions(), options, {
      searchParams: [new RequestParam('object', objectId)]
    });
    // return this.searchBy(searchHref, optionsWithObject, followLink('eperson'), followLink('object'), followLink('subject'));
    return this.searchBy(searchHref, optionsWithObject);
  }

    /**
   * Get the name of an EPerson by ID
   * @param id  ID of the EPerson
   */
  getEpersonName(audit: Audit): Observable<string> {
    if (!audit.epersonUUID) {
      return of('n/a');
    }
    return this.ePersonService.findById(audit.epersonUUID).pipe(
      take(1),
      map((rd: RemoteData<EPerson>) => rd.hasSucceeded ? rd.payload.name : 'n/a'),
    );
  }

}