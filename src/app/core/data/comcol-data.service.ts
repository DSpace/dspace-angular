import {
  distinctUntilChanged,
  filter, first,map, mergeMap, share, switchMap,
  take,
  tap
} from 'rxjs/operators';
import { merge as observableMerge, Observable, throwError as observableThrowError, combineLatest as observableCombineLatest } from 'rxjs';
import { hasValue, isEmpty, isNotEmpty } from '../../shared/empty.util';
import { ObjectCacheService } from '../cache/object-cache.service';
import { Community } from '../shared/community.model';
import { HALLink } from '../shared/hal-link.model';
import { HALResource } from '../shared/hal-resource.model';
import { CommunityDataService } from './community-data.service';

import { DataService } from './data.service';
import { DeleteRequest, FindListOptions, FindByIDRequest, RestRequest } from './request.models';
import { PaginatedList } from './paginated-list';
import { RemoteData } from './remote-data';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import {
  configureRequest,
  getRemoteDataPayload,
  getResponseFromEntry,
  getSucceededRemoteData
} from '../shared/operators';
import { CacheableObject } from '../cache/object-cache.reducer';
import { RestResponse } from '../cache/response.models';
import { Bitstream } from '../shared/bitstream.model';
import { DSpaceObject } from '../shared/dspace-object.model';

export abstract class ComColDataService<T extends CacheableObject> extends DataService<T> {
  protected abstract cds: CommunityDataService;
  protected abstract objectCache: ObjectCacheService;
  protected abstract halService: HALEndpointService;

  /**
   * Linkpath of endpoint to delete the logo
   */
  protected logoDeleteLinkpath = 'bitstreams';

  /**
   * Get the scoped endpoint URL by fetching the object with
   * the given scopeID and returning its HAL link with this
   * data-service's linkPath
   *
   * @param {string} scopeID
   *    the id of the scope object
   * @return { Observable<string> }
   *    an Observable<string> containing the scoped URL
   */
  public getBrowseEndpoint(options: FindListOptions = {}, linkPath: string = this.linkPath): Observable<string> {
    if (isEmpty(options.scopeID)) {
      return this.halService.getEndpoint(linkPath);
    } else {
      const scopeCommunityHrefObs = this.cds.getEndpoint().pipe(
        map((endpoint: string) => this.cds.getIDHref(endpoint, options.scopeID)),
        filter((href: string) => isNotEmpty(href)),
        take(1),
        tap((href: string) => {
          const request = new FindByIDRequest(this.requestService.generateRequestId(), href, options.scopeID);
          this.requestService.configure(request);
        }));

      const responses = scopeCommunityHrefObs.pipe(
        mergeMap((href: string) => this.requestService.getByHref(href)),
        getResponseFromEntry()
      );
      const errorResponses = responses.pipe(
        filter((response) => !response.isSuccessful),
        mergeMap(() => observableThrowError(new Error(`The Community with scope ${options.scopeID} couldn't be retrieved`)))
      );
      const successResponses = responses.pipe(
        filter((response) => response.isSuccessful),
        mergeMap(() => this.objectCache.getObjectByUUID(options.scopeID)),
        map((hr: HALResource) => hr._links[linkPath]),
        filter((halLink: HALLink) => isNotEmpty(halLink)),
        map((halLink: HALLink) => halLink.href)
      );

      return observableMerge(errorResponses, successResponses).pipe(distinctUntilChanged(), share());
    }
  }

  protected abstract getFindByParentHref(parentUUID: string): Observable<string>;

  public findByParent(parentUUID: string, options: FindListOptions = {}): Observable<RemoteData<PaginatedList<T>>> {
    const href$ = this.getFindByParentHref(parentUUID).pipe(
      map((href: string) => this.buildHrefFromFindOptions(href, options))
    );
    return this.findList(href$, options);
  }

  /**
   * Get the endpoint for the community or collection's logo
   * @param id  The community or collection's ID
   */
  public getLogoEndpoint(id: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      switchMap((href: string) => this.halService.getEndpoint('logo', `${href}/${id}`))
    )
  }

  /**
   * Delete the logo from the community or collection
   * @param dso The object to delete the logo from
   */
  public deleteLogo(dso: DSpaceObject): Observable<RestResponse> {
    const logo$ = (dso as any).logo;
    if (hasValue(logo$)) {
      return observableCombineLatest(
        logo$.pipe(getSucceededRemoteData(), getRemoteDataPayload(), take(1)),
        this.halService.getEndpoint(this.logoDeleteLinkpath)
      ).pipe(
        map(([logo, href]: [Bitstream, string]) => `${href}/${logo.id}`),
        map((href: string) => new DeleteRequest(this.requestService.generateRequestId(), href)),
        configureRequest(this.requestService),
        switchMap((restRequest: RestRequest) => this.requestService.getByUUID(restRequest.uuid)),
        getResponseFromEntry()
      );
    }
  }
}
