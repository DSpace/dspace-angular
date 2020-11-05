import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Audit } from 'src/app/core/audit/model/audit.model';
import { AUDIT } from 'src/app/core/audit/model/audit.resource-type';
import {map, take, tap} from 'rxjs/operators';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { EPersonDataService } from '../eperson/eperson-data.service';
import { EPerson } from '../eperson/models/eperson.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DataService } from '../data/data.service';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { PaginatedList } from '../data/paginated-list';
import { RemoteData } from '../data/remote-data';
import { FindListOptions } from '../data/request.models';
import { RequestService } from '../data/request.service';
import {followLink, FollowLinkConfig} from "../../shared/utils/follow-link-config.model";

/* tslint:disable:max-classes-per-file */

/**
 * A private DataService implementation to delegate specific methods to.
 */
class AuditDataServiceImpl extends DataService<Audit> {
  protected linkPath = 'auditevents';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<Audit>) {
    super();
  }

}

@Injectable()
@dataService(AUDIT)
export class AuditDataService {

  dataService: AuditDataServiceImpl;

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

    this.dataService = new AuditDataServiceImpl(requestService, rdbService, store, objectCache, halService,
      notificationsService, http, comparator);
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
    return this.dataService.searchBy(searchHref, optionsWithObject, followLink('eperson'));
      //.pipe(tap(value => {debugger; }));
  }

  findById(id: string, ...linksToFollow: Array<FollowLinkConfig<Audit>>): Observable<RemoteData<Audit>> {
    return this.dataService.findById(id, ...linksToFollow);
  }

  findAll(options: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<Audit>>): Observable<RemoteData<PaginatedList<Audit>>> {
    return this.dataService.findAll(options, ...linksToFollow);
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
