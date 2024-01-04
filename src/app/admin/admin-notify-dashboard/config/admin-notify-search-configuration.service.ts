import { Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { first, map, take } from 'rxjs/operators';
import { SearchConfigurationService } from "../../../core/shared/search/search-configuration.service";
import { RouteService } from "../../../core/services/route.service";
import { LinkService } from "../../../core/cache/builders/link.service";
import { HALEndpointService } from "../../../core/shared/hal-endpoint.service";
import { RequestService } from "../../../core/data/request.service";
import { RemoteDataBuildService } from "../../../core/cache/builders/remote-data-build.service";
import { PaginationService } from "../../../core/pagination/pagination.service";
import { DspaceRestResponseParsingService } from "../../../core/data/dspace-rest-response-parsing.service";
import { RemoteData } from "../../../core/data/remote-data";
import { SearchFilterConfig } from "../../../shared/search/models/search-filter-config.model";
import { GetRequest } from "../../../core/data/request.models";
import { GenericConstructor } from "../../../core/shared/generic-constructor";
import { ResponseParsingService } from "../../../core/data/parsing.service";
import { FacetConfigResponseParsingService } from "../../../core/data/facet-config-response-parsing.service";
import { FacetConfigResponse } from "../../../shared/search/models/facet-config-response.model";
import { hasNoValue, isNotEmpty } from "../../../shared/empty.util";
import { AdminNotifyFacetResponseParsingService } from "./admin-notify-facet-response-parsing.service";
import { AdminNotifySearchFilterConfig } from "./admin-notify-search-filter-config";
import { AdminNotifyFacetConfigResponse } from "./admin-notify-facet-config-response.model";
import { SearchFilter } from "../../../shared/search/models/search-filter.model";



/**
 * Service that performs all actions that have to do with the current admin notify configuration
 */
@Injectable()
export class AdminNotifySearchConfigurationService extends SearchConfigurationService {

  public paramPrefix: string;
  /**
   * Initialize class
   *
   * @param {RouteService} routeService
   * @param {PaginationService} paginationService
   * @param {ActivatedRoute} route
   * @param linkService
   * @param halService
   * @param requestService
   * @param rdb
   */
  constructor(protected routeService: RouteService,
              protected paginationService: PaginationService,
              protected route: ActivatedRoute,
              protected linkService: LinkService,
              protected halService: HALEndpointService,
              protected requestService: RequestService,
              protected rdb: RemoteDataBuildService) {
    super(routeService, paginationService, route, linkService, halService, requestService, rdb);
  }

  /**
   * @returns {Observable<Params>} Emits the current active filters with their values as they are displayed in the frontend URL
   */
  getCurrentFrontendFilters(): Observable<Params> {
    return this.routeService.getQueryParamsWithPrefix(`${this.paramPrefix}.`);
  }

  /**
   * Set prefix to be used for route filters
   * @param prefix
   */
  setParamPrefix(prefix: string) : void {
    this.paramPrefix = prefix;
  }

  /**
   * Request the filter configuration for a given scope or the whole repository
   * @param {string} scope UUID of the object for which config the filter config is requested, when no scope is provided the configuration for the whole repository is loaded
   * @param {string} configurationName the name of the configuration
   * @returns {Observable<RemoteData<SearchFilterConfig[]>>} The found filter configuration
   */
  getConfig(scope?: string, configurationName?: string): Observable<RemoteData<AdminNotifySearchFilterConfig[]>> {
    const href$ = this.halService.getEndpoint(this.facetLinkPathPrefix).pipe(
      map((url: string) => this.getConfigUrl(url, scope, configurationName)),
    );

    href$.pipe(take(1)).subscribe((url: string) => {
      let request = new GetRequest(this.requestService.generateRequestId(), url);
      request = Object.assign(request, {
        getResponseParser(): GenericConstructor<ResponseParsingService> {
          return AdminNotifyFacetResponseParsingService;
        }
      });
      this.requestService.send(request, true);
    });

    return this.rdb.buildFromHref(href$).pipe(
      map((rd: RemoteData<AdminNotifyFacetConfigResponse>) => {
        if (rd.hasSucceeded) {
          let filters: AdminNotifySearchFilterConfig[];
          if (isNotEmpty(rd.payload.filters)) {
            filters = rd.payload.filters
              .map((filter: any) => Object.assign(new AdminNotifySearchFilterConfig(), filter));
            filters.forEach(filter => filter.namePrefix = this.paramPrefix);
          } else {
            filters = [];
          }

          return new RemoteData(
            rd.timeCompleted,
            rd.msToLive,
            rd.lastUpdated,
            rd.state,
            rd.errorMessage,
            filters,
            rd.statusCode,
          );
        } else {
          return rd as any as RemoteData<AdminNotifySearchFilterConfig[]>;
        }
      })
    );
  }

  /**
   * @returns {Observable<Params>} Emits the current active filters with their values as they are sent to the backend
   */
  getCurrentFilters(): Observable<SearchFilter[]> {
    return this.getCurrentFrontendFilters().pipe(map((filterParams) => {
      if (isNotEmpty(filterParams)) {
        const filters = [];
        Object.keys(filterParams).forEach((key) => {
          // we add one to keep in account the point at the end of the prefix and set back the prefix f.
          const updatedKey = `f.${key.substring(this.paramPrefix.length + 1, key.length)}`;

          delete Object.assign(filterParams, {[updatedKey]: filterParams[key] })[key];
          key = updatedKey;
          if (key.endsWith('.min') || key.endsWith('.max')) {
            const realKey = key.slice(0, -4);
            if (hasNoValue(filters.find((f) => f.key === realKey))) {
              const min = filterParams[realKey + '.min'] ? filterParams[realKey + '.min'][0] : '*';
              const max = filterParams[realKey + '.max'] ? filterParams[realKey + '.max'][0] : '*';
              filters.push(new SearchFilter(realKey, ['[' + min + ' TO ' + max + ']'], 'equals'));
            }
          } else {
            filters.push(new SearchFilter(key, filterParams[key]));
          }
        });
        return filters;
      }
      return [];
    }));
  }
}
