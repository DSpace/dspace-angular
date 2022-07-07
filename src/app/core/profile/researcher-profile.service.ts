/* eslint-disable max-classes-per-file */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Operation, ReplaceOperation } from 'fast-json-patch';
import { Observable } from 'rxjs';
import { find, map } from 'rxjs/operators';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DataService } from '../data/data.service';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { ItemDataService } from '../data/item-data.service';
import { RemoteData } from '../data/remote-data';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NoContent } from '../shared/NoContent.model';
import { getAllCompletedRemoteData, getFirstCompletedRemoteData } from '../shared/operators';
import { ResearcherProfile } from './model/researcher-profile.model';
import { RESEARCHER_PROFILE } from './model/researcher-profile.resource-type';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { PostRequest } from '../data/request.models';
import { hasValue, isEmpty } from '../../shared/empty.util';
import { CoreState } from '../core-state.model';
import { followLink, FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { Item } from '../shared/item.model';
import { createFailedRemoteDataObject$ } from '../../shared/remote-data.utils';

/**
 * A private DataService implementation to delegate specific methods to.
 */
class ResearcherProfileServiceImpl extends DataService<ResearcherProfile> {
  protected linkPath = 'profiles';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<ResearcherProfile>) {
    super();
  }

}

/**
 * A service that provides methods to make REST requests with researcher profile endpoint.
 */
@Injectable()
@dataService(RESEARCHER_PROFILE)
export class ResearcherProfileService {

  protected dataService: ResearcherProfileServiceImpl;

  protected responseMsToLive: number = 10 * 1000;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected router: Router,
    protected comparator: DefaultChangeAnalyzer<ResearcherProfile>,
    protected itemService: ItemDataService) {

    this.dataService = new ResearcherProfileServiceImpl(requestService, rdbService, null, objectCache, halService,
      notificationsService, http, comparator);

  }

  /**
   * Find the researcher profile with the given uuid.
   *
   * @param uuid the profile uuid
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  public findById(uuid: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<ResearcherProfile>[]): Observable<RemoteData<ResearcherProfile>> {
    return this.dataService.findById(uuid, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow).pipe(
      getAllCompletedRemoteData(),
    );
  }

  /**
   * Create a new researcher profile for the current user.
   */
  public create(): Observable<RemoteData<ResearcherProfile>> {
    return this.dataService.create(new ResearcherProfile());
  }

  /**
   * Delete a researcher profile.
   *
   * @param researcherProfile the profile to delete
   */
  public delete(researcherProfile: ResearcherProfile): Observable<boolean> {
    return this.dataService.delete(researcherProfile.id).pipe(
      getFirstCompletedRemoteData(),
      map((response: RemoteData<NoContent>) => response.isSuccess)
    );
  }

  /**
   * Find a researcher profile by its own related item
   *
   * @param item
   */
  public findByRelatedItem(item: Item): Observable<RemoteData<ResearcherProfile>> {
    const profileId = item.firstMetadata('dspace.object.owner')?.authority;
    if (isEmpty(profileId)) {
      return createFailedRemoteDataObject$();
    } else {
      return this.findById(profileId);
    }
  }

  /**
   * Find the item id related to the given researcher profile.
   *
   * @param researcherProfile the profile to find for
   */
  public findRelatedItemId(researcherProfile: ResearcherProfile): Observable<string> {
    const relatedItem$ = researcherProfile.item ? researcherProfile.item : this.itemService.findByHref(researcherProfile._links.item.href, false);
    return relatedItem$.pipe(
      getFirstCompletedRemoteData(),
      map((itemRD: RemoteData<Item>) => (itemRD.hasSucceeded && itemRD.payload) ? itemRD.payload.id : null)
    );
  }

  /**
   * Change the visibility of the given researcher profile setting the given value.
   *
   * @param researcherProfile the profile to update
   * @param visible the visibility value to set
   */
  public setVisibility(researcherProfile: ResearcherProfile, visible: boolean): Observable<RemoteData<ResearcherProfile>> {
    const replaceOperation: ReplaceOperation<boolean> = {
      path: '/visible',
      op: 'replace',
      value: visible
    };

    return this.dataService.patch(researcherProfile, [replaceOperation]);
  }

  /**
   * Creates a researcher profile starting from an external source URI
   * @param sourceUri URI of source item of researcher profile.
   */
  public createFromExternalSource(sourceUri: string): Observable<RemoteData<ResearcherProfile>> {
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/uri-list');
    options.headers = headers;

    const requestId = this.requestService.generateRequestId();
    const href$ = this.halService.getEndpoint(this.dataService.getLinkPath());

    href$.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => this.dataService.buildHrefWithParams(href, [], followLink('item')))
    ).subscribe((endpoint: string) => {
      const request = new PostRequest(requestId, endpoint, sourceUri, options);
      this.requestService.send(request);
    });

    return this.rdbService.buildFromRequestUUID(requestId, followLink('item'));
  }

  /**
   * Update researcher profile by patch orcid operation
   *
   * @param researcherProfile
   * @param operations
   */
  public updateByOrcidOperations(researcherProfile: ResearcherProfile, operations: Operation[]): Observable<RemoteData<ResearcherProfile>> {
    return this.dataService.patch(researcherProfile, operations);
  }



}
