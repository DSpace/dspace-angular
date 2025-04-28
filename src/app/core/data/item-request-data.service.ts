import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  find,
  map,
} from 'rxjs/operators';

import { RequestCopyEmail } from '../../request-copy/email-request-copy/request-copy-email.model';
import {
  hasValue,
  isNotEmpty,
} from '../../shared/empty.util';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { Bitstream } from '../shared/bitstream.model';
import { ConfigurationProperty } from '../shared/configuration-property.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ItemRequest } from '../shared/item-request.model';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { sendRequest } from '../shared/request.operators';
import { IdentifiableDataService } from './base/identifiable-data.service';
import {
  SearchData,
  SearchDataImpl,
} from './base/search-data';
import { ConfigurationDataService } from './configuration-data.service';
import { AuthorizationDataService } from './feature-authorization/authorization-data.service';
import { FeatureID } from './feature-authorization/feature-id';
import { FindListOptions } from './find-list-options.model';
import { PaginatedList } from './paginated-list.model';
import { RemoteData } from './remote-data';
import {
  PostRequest,
  PutRequest,
} from './request.models';
import { RequestService } from './request.service';

/**
 * A service responsible for fetching/sending data from/to the REST API on the itemrequests endpoint
 */
@Injectable({
  providedIn: 'root',
})
export class ItemRequestDataService extends IdentifiableDataService<ItemRequest> implements SearchData<ItemRequest> {

  private searchData: SearchDataImpl<ItemRequest>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected configService: ConfigurationDataService,
    protected authorizationService: AuthorizationDataService,
  ) {
    super('itemrequests', requestService, rdbService, objectCache, halService);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  getItemRequestEndpoint(): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }

  /**
   * Get the endpoint for an {@link ItemRequest} by their token
   * @param token
   */
  getItemRequestEndpointByToken(token: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((href: string) => `${href}/${token}`));
  }

  /**
   * Request a copy of an item
   * @param itemRequest
   * @param captchaPayload payload of captcha verification
   */
  requestACopy(itemRequest: ItemRequest, captchaPayload: string): Observable<RemoteData<ItemRequest>> {
    const requestId = this.requestService.generateRequestId();

    const href$ = this.getItemRequestEndpoint();

    // Inject captcha payload into headers
    const options: HttpOptions = Object.create({});
    if (captchaPayload) {
      let headers = new HttpHeaders();
      headers = headers.set('x-captcha-payload', captchaPayload);
      options.headers = headers;
    }

    href$.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        const request = new PostRequest(requestId, href, itemRequest, options);
        this.requestService.send(request, false);
      }),
    ).subscribe();

    return this.rdbService.buildFromRequestUUID<ItemRequest>(requestId).pipe(
      getFirstCompletedRemoteData(),
    );
  }

  /**
   * Deny the request of an item
   * @param token Token of the {@link ItemRequest}
   * @param email Email to send back to the user requesting the item
   */
  deny(token: string, email: RequestCopyEmail): Observable<RemoteData<ItemRequest>> {
    return this.process(token, email, false);
  }

  /**
   * Grant the request of an item
   * @param token Token of the {@link ItemRequest}
   * @param email Email to send back to the user requesting the item
   * @param suggestOpenAccess Whether or not to suggest the item to become open access
   * @param accessPeriod How long in seconds to grant access, from the decision date (only applies to links, not attachments)
   */
  grant(token: string, email: RequestCopyEmail, suggestOpenAccess = false, accessPeriod: string = null): Observable<RemoteData<ItemRequest>> {
    return this.process(token, email, true, suggestOpenAccess, accessPeriod);
  }

  /**
   * Process the request of an item
   * @param token Token of the {@link ItemRequest}
   * @param email Email to send back to the user requesting the item
   * @param grant Grant or deny the request (true = grant, false = deny)
   * @param suggestOpenAccess Whether or not to suggest the item to become open access
   * @param accessPeriod How long in seconds to grant access, from the decision date (only applies to links, not attachments)
   */
  process(token: string, email: RequestCopyEmail, grant: boolean, suggestOpenAccess = false, accessPeriod: string = null): Observable<RemoteData<ItemRequest>> {
    const requestId = this.requestService.generateRequestId();

    this.getItemRequestEndpointByToken(token).pipe(
      distinctUntilChanged(),
      map((endpointURL: string) => {
        const options: HttpOptions = Object.create({});
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        options.headers = headers;
        return new PutRequest(requestId, endpointURL, JSON.stringify({
          acceptRequest: grant,
          responseMessage: email.message,
          subject: email.subject,
          suggestOpenAccess,
          accessPeriod: accessPeriod,
        }), options);
      }),
      sendRequest(this.requestService),
    ).subscribe();

    return this.rdbService.buildFromRequestUUID(requestId);
  }

  /**
   * Get a sanitized item request using the searchBy method and the access token sent to the original requester.
   *
   * @param accessToken access token contained in the secure link sent to a requester
   */
  getSanitizedRequestByAccessToken(accessToken: string): Observable<RemoteData<ItemRequest>> {
    const findListOptions = Object.assign({}, new FindListOptions(), {
      searchParams: [
        new RequestParam('accessToken', accessToken),
      ],
    });
    const hrefObs = this.getSearchByHref(
      'byAccessToken',
      findListOptions,
    );

    return this.searchData.findByHref(
      hrefObs,
    );
  }

  searchBy(searchMethod: string, options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<ItemRequest>[]): Observable<RemoteData<PaginatedList<ItemRequest>>> {
    return this.searchData.searchBy(searchMethod, options, useCachedVersionIfAvailable, reRequestOnStale);
  }

  /**
   * Get configured access periods (in seconds) to populate the dropdown in the item request approval form
   * if the 'send secure link' feature is configured.
   * Expects integer values, conversion to number is done in this processing
   */
  getConfiguredAccessPeriods(): Observable<string[]> {
    return this.configService.findByPropertyName('request.item.grant.link.period').pipe(
      getFirstCompletedRemoteData(),
      map((propertyRD: RemoteData<ConfigurationProperty>) => propertyRD.hasSucceeded ? propertyRD.payload.values : []),
    );
  }

  /**
   * Is the request copy form protected by a captcha? This will be used to decide whether to render the captcha
   * component in bitstream-request-a-copy-page component
   */
  isProtectedByCaptcha(): Observable<boolean> {
    return this.configService.findByPropertyName('request.item.create.captcha').pipe(
      getFirstCompletedRemoteData(),
      map((rd) => {
        if (rd.hasSucceeded) {
          return rd.payload.values.length > 0 && rd.payload.values[0] === 'true';
        } else {
          return false;
        }
      }));
  }

  /**
   * Create the HREF for a specific object's search method with given options object
   *
   * @param searchMethod The search method for the object
   * @param options The [[FindListOptions]] object
   * @return {Observable<string>}
   *    Return an observable that emits created HREF
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  public getSearchByHref(searchMethod: string, options?: FindListOptions, ...linksToFollow: FollowLinkConfig<ItemRequest>[]): Observable<string> {
    return this.searchData.getSearchByHref(searchMethod, options, ...linksToFollow);
  }

  /**
   * Authorization check to see if the user already has download access to the given bitstream.
   * Wrapped in this service to give it a central place and make it easy to mock for testing.
   *
   * @param bitstream The bitstream to be downloaded
   * @return {Observable<boolean>} true if user may download, false if not
   */
  canDownload(bitstream: Bitstream): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.CanDownload, bitstream?.self);
  }
}
