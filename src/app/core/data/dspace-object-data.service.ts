import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { validate as uuidValidate } from 'uuid';

import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DSpaceObject } from '../shared/dspace-object.model';
import { DSPACE_OBJECT } from '../shared/dspace-object.resource-type';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RequestService } from './request.service';
import { IdentifiableDataService } from './base/identifiable-data.service';
import { dataService } from './base/data-service.decorator';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { RemoteData } from './remote-data';
import { RequestParam } from '../cache/models/request-param.model';
import { isNotEmpty } from '../../shared/empty.util';

@Injectable()
@dataService(DSPACE_OBJECT)
export class DSpaceObjectDataService extends IdentifiableDataService<DSpaceObject> {

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super(
      'dso', requestService, rdbService, objectCache, halService, undefined,
      // interpolate uuid as query parameter
      (endpoint: string, resourceID: string): string => {
        return endpoint.replace(/{\?uuid}/, `?uuid=${resourceID}`);
      },
    );
  }

  /**
   * Returns an observable of {@link RemoteData} of an object, based on its ID, with a list of
   * {@link FollowLinkConfig}, to automatically resolve {@link HALLink}s of the object
   *
   * @param id                          ID of object we want to retrieve
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  findById(id: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<DSpaceObject>[]): Observable<RemoteData<DSpaceObject>> {

    if (uuidValidate(id)) {
      const href$ = this.getIDHrefObs(encodeURIComponent(id), ...linksToFollow);
      return super.findByHref(href$, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
    } else {
      return this.findByCustomUrl(id, useCachedVersionIfAvailable, reRequestOnStale, linksToFollow);
    }
  }

  /**
   * Returns an observable of {@link RemoteData} of an object, based on its CustomURL or ID, with a list of
   * {@link FollowLinkConfig}, to automatically resolve {@link HALLink}s of the object
   *
   * @param id                          CustomUrl or UUID of object we want to retrieve
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   * @param projections                 List of {@link projections} used to pass as parameters
   */
  private findByCustomUrl(id: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, linksToFollow: FollowLinkConfig<DSpaceObject>[] = [], projections: string[] = []): Observable<RemoteData<DSpaceObject>> {
    const searchMethod = 'findByCustomURL';

    const options = Object.assign({}, {
      searchParams: [
        new RequestParam('q', id),
      ]
    });

    projections.forEach((projection) => {
      options.searchParams.push(new RequestParam('projection', projection));
    });

    const hrefObs = this.halService.getEndpoint('items').pipe(
      filter((href: string) => isNotEmpty(href)),
      map((href: string) => `${href}/search/${searchMethod}`),
      map((href: string) => this.buildHrefFromFindOptions(href, options, [], ...linksToFollow))
    );

    return this.findByHref(hrefObs, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }
}
