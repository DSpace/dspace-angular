import { SearchConfigurationService } from "../../../core/shared/search/search-configuration.service";
import { PaginationComponentOptions } from "../../../shared/pagination/pagination-component-options.model";
import { SortDirection, SortOptions } from "../../../core/cache/models/sort-options.model";
import { RouteService } from "../../../core/services/route.service";
import { ActivatedRoute } from "@angular/router";
import { LinkService } from "../../../core/cache/builders/link.service";
import { HALEndpointService } from "../../../core/shared/hal-endpoint.service";
import { RequestService } from "../../../core/data/request.service";
import { RemoteDataBuildService } from "../../../core/cache/builders/remote-data-build.service";
import { PaginationService } from '../../../core/pagination/pagination.service';
import { Injectable } from "@angular/core";
import { PaginatedSearchOptions } from "../../../shared/search/models/paginated-search-options.model";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { hasValue } from "../../../shared/empty.util";



/**
 * Service that performs all actions that have to do with the current notify configuration
 */
@Injectable()
export class AdminNotifyLogsConfigurationService extends SearchConfigurationService {


  /**
   * Endpoint link path for retrieving general search results
   */
  private searchLinkPath = 'discover/search/objects';
  /**
   * Default pagination settings
   */
  protected defaultPagination = Object.assign(new PaginationComponentOptions(), {
    id: 'notify-logs-page',
    pageSize: 10,
    currentPage: 1
  });
  /**
   * Default sort settings
   */
  protected defaultSort = new SortOptions('dc.date.issued', SortDirection.DESC);

  /**
   * Default scope setting
   */
  protected defaultScope = '';

  /**
   * Default query setting
   */
  protected defaultQuery = '';


  /**
   * Initialize class
   *
   * @param {roleService} roleService
   * @param {RouteService} routeService
   * @param {PaginationService} paginationService
   * @param {ActivatedRoute} route
   * @param linkService
   * @param halService
   * @param requestService
   * @param rdb
   */
  constructor(
              protected routeService: RouteService,
              protected paginationService: PaginationService,
              protected route: ActivatedRoute,
              protected linkService: LinkService,
              protected halService: HALEndpointService,
              protected requestService: RequestService,
              protected rdb: RemoteDataBuildService) {

    super(routeService, paginationService, route, linkService, halService, requestService, rdb);

    // override parent class initialization
    this._defaults = null;
    this.initDefaults();
  }

  getEndpoint(searchOptions?: PaginatedSearchOptions): Observable<string> {
    return this.halService.getEndpoint(this.searchLinkPath).pipe(
      map((url: string) => {
        if (hasValue(searchOptions)) {
          return (searchOptions as PaginatedSearchOptions).toRestUrl(url);
        } else {
          return url;
        }
      })
    );
  }
}
