import { Injectable } from '@angular/core';
import { flatMap, map, switchMap, tap } from 'rxjs/operators';
import { Observable, of as observableOf } from 'rxjs';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { GetRequest, RestRequest } from '../../../core/data/request.models';
import { RequestService } from '../../../core/data/request.service';
import { ResponseParsingService } from '../../../core/data/parsing.service';
import { GenericConstructor } from '../../../core/shared/generic-constructor';
import { FilteredDiscoveryPageResponseParsingService } from '../../../core/data/filtered-discovery-page-response-parsing.service';
import { hasValue } from '../../../shared/empty.util';
import { configureRequest, getResponseFromEntry } from '../../../core/shared/operators';
import { RouteService } from '../../../shared/services/route.service';
import { FilteredDiscoveryQueryResponse } from '../../../core/cache/response.models';

/**
 * Service for performing actions on the filtered-discovery-pages REST endpoint
 */
@Injectable()
export class SearchFixedFilterService {
  private queryByFilterPath = 'filtered-discovery-pages';

  constructor(private routeService: RouteService,
              protected requestService: RequestService,
              private halService: HALEndpointService) {

  }

  /**
   * Get the filter query for a certain filter by name
   * @param {string} filterName     Name of the filter
   * @returns {Observable<string>}  Filter query
   */
  getQueryByFilterName(filterName: string): Observable<string> {
    if (hasValue(filterName)) {
      const requestUuid = this.requestService.generateRequestId();
      const requestObs = this.halService.getEndpoint(this.queryByFilterPath).pipe(
        map((url: string) => {
          url += ('/' + filterName);
          const request = new GetRequest(requestUuid, url);
          return Object.assign(request, {
            getResponseParser(): GenericConstructor<ResponseParsingService> {
              return FilteredDiscoveryPageResponseParsingService;
            }
          });
        }),
        configureRequest(this.requestService)
      );

      const requestEntryObs = requestObs.pipe(
        switchMap((request: RestRequest) => this.requestService.getByHref(request.href)),
      );
      const filterQuery = requestEntryObs.pipe(
        getResponseFromEntry(),
        map((response: FilteredDiscoveryQueryResponse) =>
          response.filterQuery
        ));
      return filterQuery;
    }
    return observableOf(undefined);
  }

  /**
   * Get the query for looking up items by relation type
   * @param {string} relationType   Relation type
   * @param {string} itemUUID       Item UUID
   * @returns {string}              Query
   */
  getQueryByRelations(relationType: string, itemUUID: string): string {
    return `query=relation.${relationType}:${itemUUID}`;
  }

  /**
   * Get the filter for a relation with the item's UUID
   * @param relationType    The type of relation e.g. 'isAuthorOfPublication'
   * @param itemUUID        The item's UUID
   */
  getFilterByRelation(relationType: string, itemUUID: string): string {
    return `f.${relationType}=${itemUUID}`;
  }
}
