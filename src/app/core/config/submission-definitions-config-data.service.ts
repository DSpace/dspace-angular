/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { Injectable } from '@angular/core';
import { FollowLinkConfig } from '@dspace/core/shared/follow-link-config.model';
import {
  createFailedRemoteDataObject,
  createFailedRemoteDataObjectFromError,
  createSuccessfulRemoteDataObject,
} from '@dspace/core/utilities/remote-data.utils';
import {
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';
import isEmpty from 'lodash/isEmpty';
import {
  EMPTY,
  Observable,
  of,
} from 'rxjs';
import {
  catchError,
  expand,
  map,
  mergeMap,
  reduce,
  take,
} from 'rxjs/operators';

import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { FindListOptions } from '../data/find-list-options.model';
import {
  buildPaginatedList,
  PaginatedList,
} from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { PageInfo } from '../shared/page-info.model';
import { ConfigDataService } from './config-data.service';
import { ConfigObject } from './models/config.model';
import { SubmissionDefinitionsModel } from './models/config-submission-definitions.model';
import { SubmissionSectionModel } from './models/config-submission-section.model';

/**
 * Number of {@link SubmissionSectionModel}s requested per page when following the `sections` HAL
 * link. A larger page size reduces the number of HTTP requests needed to fetch every section.
 * Adjust here if the backend default or performance characteristics change.
 */
export const SUBMISSION_SECTIONS_PAGE_SIZE = 100;

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

  /**
   * Follow the `sections` HAL link on the given {@link SubmissionDefinitionsModel} and fetch ALL
   * pages of {@link SubmissionSectionModel}s, aggregating them into a single {@link PaginatedList}.
   *
   * Since the submission form needs every section in order to render completely, this method keeps
   * following the `next` page link until the last page has been retrieved before emitting.
   *
   * @param definition                  The {@link SubmissionDefinitionsModel} whose `sections` link
   *                                    should be followed
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's no
   *                                    valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @return An observable emitting a {@link RemoteData} of a {@link PaginatedList} containing every
   *         section across all pages. Emits `undefined` when the `sections` link is missing (so the
   *         caller can fall back), or a failed {@link RemoteData} when a page request fails.
   */
  findAllSections(definition: SubmissionDefinitionsModel, useCachedVersionIfAvailable = true, reRequestOnStale = true): Observable<RemoteData<PaginatedList<SubmissionSectionModel>>> {
    const sectionsHref = hasValue(definition?._links?.sections) ? definition._links.sections.href : undefined;

    if (isEmpty(sectionsHref)) {
      // No sections link present (e.g. an older backend). Signal the caller to fall back.
      return of(undefined);
    }

    let firstFailure: RemoteData<PaginatedList<ConfigObject>>;

    return this.fetchSectionsPage(sectionsHref, useCachedVersionIfAvailable, reRequestOnStale).pipe(
      expand((rd: RemoteData<PaginatedList<ConfigObject>>) => {
        const nextHref = (rd.hasSucceeded && hasValue(rd.payload)) ? rd.payload.next : undefined;
        return isNotEmpty(nextHref)
          ? this.fetchSectionsPage(nextHref, useCachedVersionIfAvailable, reRequestOnStale)
          : EMPTY;
      }),
      reduce((sections: ConfigObject[], rd: RemoteData<PaginatedList<ConfigObject>>) => {
        if (!rd.hasSucceeded || !hasValue(rd.payload)) {
          firstFailure = firstFailure ?? rd;
          return sections;
        }
        return sections.concat(rd.payload.page ?? []);
      }, []),
      map((sections: ConfigObject[]) => {
        if (hasValue(firstFailure)) {
          return createFailedRemoteDataObject<PaginatedList<SubmissionSectionModel>>(firstFailure.errorMessage, firstFailure.statusCode, firstFailure.timeCompleted, firstFailure.errors);
        }
        const pageInfo = new PageInfo({ elementsPerPage: sections.length, totalElements: sections.length, totalPages: 1, currentPage: 1 });
        return createSuccessfulRemoteDataObject(buildPaginatedList(pageInfo, sections as SubmissionSectionModel[]));
      }),
    );
  }

  /**
   * Fetch a single page of section config objects from the given href.
   */
  private fetchSectionsPage(href: string, useCachedVersionIfAvailable: boolean, reRequestOnStale: boolean): Observable<RemoteData<PaginatedList<ConfigObject>>> {
    const options: FindListOptions = { elementsPerPage: SUBMISSION_SECTIONS_PAGE_SIZE };
    return super.findListByHref(href, options, useCachedVersionIfAvailable, reRequestOnStale).pipe(
      getFirstCompletedRemoteData(),
      catchError((error: unknown) => of(createFailedRemoteDataObjectFromError<PaginatedList<ConfigObject>>(error))),
    );
  }
}
