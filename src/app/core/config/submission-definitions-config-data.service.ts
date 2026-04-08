/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { Injectable } from '@angular/core';
import { FollowLinkConfig } from '@dspace/core/shared/follow-link-config.model';
import { Observable } from 'rxjs';
import {
  mergeMap,
  take,
} from 'rxjs/operators';

import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { FindListOptions } from '../data/find-list-options.model';
import { PaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ConfigDataService } from './config-data.service';
import { ConfigObject } from './models/config.model';

/**
 * Data service responsible for retrieving submission definition configurations from the REST API.
 * Submission definitions describe the structure of submission forms (steps, sections, and fields)
 * used when depositing or editing items.
 *
 * It extends {@link ConfigDataService} targeting the `submissiondefinitions` endpoint.
 */
@Injectable({ providedIn: 'root' })
export class SubmissionDefinitionsConfigDataService extends ConfigDataService {
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('submissiondefinitions', requestService, rdbService, objectCache, halService);
  }

  /**
   * Retrieves the full list of submission definition configurations from the REST API.
   *
   * @param options
   * @param useCachedVersionIfAvailable
   * @param reRequestOnStale
   * @param linksToFollow
   * @returns An {@link Observable} emitting a {@link RemoteData} wrapper around a {@link PaginatedList} of {@link ConfigObject} entries.
   */
  findAll(options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<ConfigObject>[]): Observable<RemoteData<PaginatedList<ConfigObject>>> {
    return this.getBrowseEndpoint(options).pipe(
      take(1),
      mergeMap((href: string) => super.findListByHref(href, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow)),
    );
  }
}
