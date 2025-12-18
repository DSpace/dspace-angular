import { Injectable } from '@angular/core';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import {
  followLink,
  FollowLinkConfig,
} from '@dspace/core/shared/follow-link-config.model';
import { hasValue } from '@dspace/shared/utils/empty.util';
import {
  Observable,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { Audit } from '../audit/model/audit.model';
import { DSONameService } from '../breadcrumbs/dso-name.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { EPerson } from '../eperson/models/eperson.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { DeleteDataImpl } from './base/delete-data';
import {
  FindAllData,
  FindAllDataImpl,
} from './base/find-all-data';
import { IdentifiableDataService } from './base/identifiable-data.service';
import { SearchDataImpl } from './base/search-data';
import { FindListOptions } from './find-list-options.model';
import { PaginatedList } from './paginated-list.model';
import { RemoteData } from './remote-data';
import { RequestService } from './request.service';

export const AUDIT_PERSON_NOT_AVAILABLE = 'n/a';

export const AUDIT_FIND_BY_OBJECT_SEARCH_METHOD = 'findByObject';

@Injectable({ providedIn: 'root' })
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
    protected dsoNameService: DSONameService,
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
   * @param useCachedVersionIfAvailable
   * @return Observable<RemoteData<PaginatedList<Audit>>>
   */
  findByObject(objectId: string, options: FindListOptions = {}, useCachedVersionIfAvailable = true): Observable<RemoteData<PaginatedList<Audit>>> {
    const searchMethod = AUDIT_FIND_BY_OBJECT_SEARCH_METHOD;
    const searchParams = [new RequestParam('object', objectId)];

    const optionsWithObject = Object.assign(new FindListOptions(), options, {
      searchParams,
    });
    return this.searchData.searchBy(searchMethod, optionsWithObject, useCachedVersionIfAvailable, true, followLink('eperson'));
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
    if (!audit.eperson) {
      return of(AUDIT_PERSON_NOT_AVAILABLE);
    }

    return audit.eperson.pipe(
      getFirstCompletedRemoteData(),
      map((epersonRd: RemoteData<EPerson>) => epersonRd.payload ? this.dsoNameService.getName(epersonRd.payload) : AUDIT_PERSON_NOT_AVAILABLE),
    );
  }

  /**
   *
   * @param audit
   * @param contextObjectId
   */
  getOtherObject(audit: Audit, contextObjectId: string): Observable<Audit> {
    const otherObjectHref = this.getOtherObjectHref(audit, contextObjectId);

    if (otherObjectHref) {
      return this.findByHref(otherObjectHref).pipe(
        getFirstCompletedRemoteData(),
        map(rd => rd.payload ?? null),
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

  auditHasDetails(audit: Audit): boolean {
    return hasValue(audit.metadataField)
      || hasValue(audit.authority)
      || hasValue(audit.confidence)
      || hasValue(audit.checksum)
      || hasValue(audit.authority)
      || hasValue(audit.place)
      || hasValue(audit.value);
  }

}
