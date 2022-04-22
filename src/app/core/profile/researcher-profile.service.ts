/* eslint-disable max-classes-per-file */

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Operation, RemoveOperation, ReplaceOperation } from 'fast-json-patch';
import { combineLatest, Observable, of as observableOf } from 'rxjs';
import { catchError, find, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { ConfigurationDataService } from '../data/configuration-data.service';
import { DataService } from '../data/data.service';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { ItemDataService } from '../data/item-data.service';
import { RemoteData } from '../data/remote-data';
import { RequestService } from '../data/request.service';
import { ConfigurationProperty } from '../shared/configuration-property.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Item } from '../shared/item.model';
import { NoContent } from '../shared/NoContent.model';
import {
  getFinishedRemoteData,
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload
} from '../shared/operators';
import { ResearcherProfile } from './model/researcher-profile.model';
import { RESEARCHER_PROFILE } from './model/researcher-profile.resource-type';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { PostRequest } from '../data/request.models';
import { hasValue } from '../../shared/empty.util';

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

    dataService: ResearcherProfileServiceImpl;

    responseMsToLive: number = 10 * 1000;

    constructor(
        protected requestService: RequestService,
        protected rdbService: RemoteDataBuildService,
        protected store: Store<CoreState>,
        protected objectCache: ObjectCacheService,
        protected halService: HALEndpointService,
        protected notificationsService: NotificationsService,
        protected http: HttpClient,
        protected router: Router,
        protected comparator: DefaultChangeAnalyzer<ResearcherProfile>,
        protected itemService: ItemDataService,
        protected configurationService: ConfigurationDataService ) {

            this.dataService = new ResearcherProfileServiceImpl(requestService, rdbService, store, objectCache, halService,
                notificationsService, http, comparator);

    }

    /**
     * Find the researcher profile with the given uuid.
     *
     * @param uuid the profile uuid
     */
    findById(uuid: string): Observable<ResearcherProfile> {
        return this.dataService.findById(uuid, false)
            .pipe ( getFinishedRemoteData(),
                map((remoteData) => remoteData.payload));
    }

    /**
     * Create a new researcher profile for the current user.
     */
    create(): Observable<RemoteData<ResearcherProfile>> {
        return this.dataService.create( new ResearcherProfile());
    }

    /**
     * Delete a researcher profile.
     *
     * @param researcherProfile the profile to delete
     */
    delete(researcherProfile: ResearcherProfile): Observable<boolean> {
      return this.dataService.delete(researcherProfile.id).pipe(
        getFirstCompletedRemoteData(),
        tap((response: RemoteData<NoContent>) => {
          if (response.isSuccess) {
            this.requestService.setStaleByHrefSubstring(researcherProfile._links.self.href);
          }
        }),
        map((response: RemoteData<NoContent>) => response.isSuccess)
      );
    }

    /**
     * Find the item id related to the given researcher profile.
     *
     * @param researcherProfile the profile to find for
     */
    findRelatedItemId( researcherProfile: ResearcherProfile ): Observable<string> {
        return this.itemService.findByHref(researcherProfile._links.item.href, false)
            .pipe (getFirstSucceededRemoteDataPayload(),
            catchError((error) => {
                console.debug(error);
                return observableOf(null);
            }),
            map((item) => item != null ? item.id : null ));
    }

    /**
     * Change the visibility of the given researcher profile setting the given value.
     *
     * @param researcherProfile the profile to update
     * @param visible the visibility value to set
     */
    setVisibility(researcherProfile: ResearcherProfile, visible: boolean): Observable<ResearcherProfile> {

      const replaceOperation: ReplaceOperation<boolean> = {
          path: '/visible',
          op: 'replace',
          value: visible
      };

      return this.patch(researcherProfile, [replaceOperation]).pipe (
        switchMap( ( ) => this.findById(researcherProfile.id))
      );
    }

    patch(researcherProfile: ResearcherProfile, operations: Operation[]): Observable<RemoteData<ResearcherProfile>> {
      return this.dataService.patch(researcherProfile, operations);
    }

    /**
     * Check if the given item is linked to an ORCID profile.
     *
     * @param item the item to check
     * @returns the check result
     */
    isLinkedToOrcid(item: Item): boolean {
      return item.hasMetadata('cris.orcid.authenticated');
    }

    /**
     * Returns true if only the admin users can disconnect a researcher profile from ORCID.
     *
     * @returns the check result
     */
    onlyAdminCanDisconnectProfileFromOrcid(): Observable<boolean> {
      return this.getOrcidDisconnectionAllowedUsersConfiguration().pipe(
        map((property) => property.values.map( (value) => value.toLowerCase()).includes('only_admin'))
      );
    }

    /**
     * Returns true if the profile's owner can disconnect that profile from ORCID.
     *
     * @returns the check result
     */
    ownerCanDisconnectProfileFromOrcid(): Observable<boolean> {
      return this.getOrcidDisconnectionAllowedUsersConfiguration().pipe(
        map((property) => {
          const values = property.values.map( (value) => value.toLowerCase());
          return values.includes('only_owner') || values.includes('admin_and_owner');
        })
      );
    }

    /**
     * Returns true if the admin users can disconnect a researcher profile from ORCID.
     *
     * @returns the check result
     */
    adminCanDisconnectProfileFromOrcid(): Observable<boolean> {
      return this.getOrcidDisconnectionAllowedUsersConfiguration().pipe(
        map((property) => {
          const values = property.values.map( (value) => value.toLowerCase());
          return values.includes('only_admin') || values.includes('admin_and_owner');
        })
      );
    }

    /**
     * If the given item represents a profile unlink it from ORCID.
     */
     unlinkOrcid(item: Item): Observable<RemoteData<ResearcherProfile>> {

      const operations: RemoveOperation[] = [{
        path:'/orcid',
        op:'remove'
      }];

      return this.findById(item.firstMetadata('cris.owner').authority).pipe(
        switchMap((profile) => this.patch(profile, operations)),
        getFinishedRemoteData()
      );
    }

    getOrcidAuthorizeUrl(profile: Item): Observable<string> {
      return combineLatest([
        this.configurationService.findByPropertyName('orcid.authorize-url').pipe(getFirstSucceededRemoteDataPayload()),
        this.configurationService.findByPropertyName('orcid.application-client-id').pipe(getFirstSucceededRemoteDataPayload()),
        this.configurationService.findByPropertyName('orcid.scope').pipe(getFirstSucceededRemoteDataPayload())]
      ).pipe(
        map(([authorizeUrl, clientId, scopes]) => {
          const redirectUri = environment.rest.baseUrl + '/api/cris/orcid/' + profile.id + '/?url=' + encodeURIComponent(this.router.url);
          return authorizeUrl.values[0] + '?client_id=' + clientId.values[0]   + '&redirect_uri=' + redirectUri + '&response_type=code&scope='
          + scopes.values.join(' ');
      }));
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
      map((href: string) => {
        const request = new PostRequest(requestId, href, sourceUri, options);
        this.requestService.send(request);
      })
    ).subscribe();

    return this.rdbService.buildFromRequestUUID(requestId);
  }

    private getOrcidDisconnectionAllowedUsersConfiguration(): Observable<ConfigurationProperty> {
      return this.configurationService.findByPropertyName('orcid.disconnection.allowed-users').pipe(
        getFirstSucceededRemoteDataPayload()
      );
    }

}
