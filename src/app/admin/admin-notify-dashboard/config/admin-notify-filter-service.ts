import { Inject, Injectable } from "@angular/core";
import { FILTER_CONFIG, SearchFilterService } from "../../../core/shared/search/search-filter.service";
import { Store } from "@ngrx/store";
import { SearchFiltersState } from "../../../shared/search/search-filters/search-filter/search-filter.reducer";
import { RouteService } from "../../../core/services/route.service";
import { SearchFilterConfig } from "../../../shared/search/models/search-filter-config.model";


/**
 * Service that performs all actions that have to do with search filters and facets
 */
@Injectable()
export class AdminNotifySearchFilterService extends SearchFilterService {

  public filterPrefix: string;
  constructor(protected store: Store<SearchFiltersState>,
              protected routeService: RouteService) {
    super(store, routeService)
  }

  /**
   * Fetch the current active filters from the query parameters
   * @returns {Observable<Params>}
   */
  getCurrentFilters() {
    return this.routeService.getQueryParamsWithPrefix(`${this.filterPrefix}.`);
  }

  /**
   * Set prefix to be used for route filters
   * @param prefix
   */
  setParamPrefix(prefix: string) : void {
    this.filterPrefix = prefix;
  }
}
