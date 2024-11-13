import { Injectable } from '@angular/core';


import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { Audit } from './model/audit.model';
import { AUDIT } from './model/audit.resource-type';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../data/base/data-service.decorator';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { EPerson } from '../eperson/models/eperson.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { PaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { FindListOptions } from '../data/find-list-options.model';
import { RequestService } from '../data/request.service';
import {
  getFirstSucceededRemoteDataPayload,
  getFirstSucceededRemoteDataWithNotEmptyPayload,
} from '../shared/operators';
import { followLink, FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { IdentifiableDataService } from '../data/base/identifiable-data.service';
import { SearchDataImpl } from '../data/base/search-data';
import { DeleteDataImpl } from '../data/base/delete-data';
import { FindAllData, FindAllDataImpl } from '../data/base/find-all-data';
import { DSONameService } from '../breadcrumbs/dso-name.service';
import { hasValue } from '../../shared/empty.util';

export const AUDIT_PERSON_NOT_AVAILABLE = 'n/a';

export const AUDIT_FIND_BY_OBJECT_SEARCH_METHOD = 'findByObject';

@Injectable()
@dataService(AUDIT)
export class AuditDataService extends IdentifiableDataService<Audit>{

  private searchData: SearchDataImpl<Audit>;
  private findAllData: FindAllData<Audit>;
  private deleteData: DeleteDataImpl<Audit>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected dsoNameService: DSONameService
  ) {
    super('auditevents', requestService, rdbService, objectCache, halService);

    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.deleteData = new DeleteDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive, this.constructIdEndpoint);
  }

  /**
   * Get all audit event for the object.
   *
   * @param objectId The objectId id
   * @param options The [[FindListOptions]] object
   * @param collUuid The Uuid of the collection
   * @param commUuid The Uuid of the community
   * @return Observable<RemoteData<PaginatedList<Audit>>>
   */
  findByObject(objectId: string, options: FindListOptions = {}, collUuid?: string, commUuid?: string): Observable<RemoteData<PaginatedList<Audit>>> {
    const searchMethod = AUDIT_FIND_BY_OBJECT_SEARCH_METHOD;
    const searchParams = [new RequestParam('object', objectId)];

    if (hasValue(commUuid)) {
      searchParams.push(new RequestParam('commUuid', commUuid));
    }

    if (hasValue(collUuid)) {
      searchParams.push(new RequestParam('collUuid', collUuid));
    }
    const optionsWithObject = Object.assign(new FindListOptions(), options, {
      searchParams
    });
    return this.searchData.searchBy(searchMethod, optionsWithObject, true, true, followLink('eperson'));
  }

  /**
   * Returns an observable of {@link RemoteData} of an object, based on its ID, with a list of
   * {@link FollowLinkConfig}, to automatically resolve {@link HALLink}s of the object
   * @param id                          ID of object we want to retrieve
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  findById(id: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Audit>[]): Observable<RemoteData<Audit>> {
    return super.findById(id, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  findAll(options?: FindListOptions, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Audit>[]): Observable<RemoteData<PaginatedList<Audit>>> {
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Get the name of an EPerson by ID
   * @param audit  The audit object
   */
  getEpersonName(audit: Audit): Observable<string> {

    if (!audit.epersonUUID) {
      return of(AUDIT_PERSON_NOT_AVAILABLE);
    }

    // TODO to be reviewed when https://github.com/DSpace/dspace-angular/issues/644 will be resolved
    return audit.eperson.pipe(
      getFirstSucceededRemoteDataWithNotEmptyPayload(),
      map((eperson: EPerson) => this.dsoNameService.getName(eperson)),
      startWith(AUDIT_PERSON_NOT_AVAILABLE));
  }

  /**
   *
   * @param audit
   * @param contextObjectId
   */
  getOtherObject(audit: Audit, contextObjectId: string): Observable<any> {
    const otherObjectHref = this.getOtherObjectHref(audit, contextObjectId);

    if (otherObjectHref) {
      return this.findByHref(otherObjectHref).pipe(
        getFirstSucceededRemoteDataPayload()
      );
    }
    return of(null);
  }

  getOtherObjectHref(audit: Audit, contextObjectId: string): string {
    if (audit.objectUUID === null) {
      return null;
    }
    if (contextObjectId === audit.objectUUID) {
      // other object is on the subject field
      return audit._links.subject.href;
    } else if (contextObjectId === audit.subjectUUID) {
      // other object is on the object field
      return audit._links.object.href;
    } else {
      return null;
    }
  }

}
