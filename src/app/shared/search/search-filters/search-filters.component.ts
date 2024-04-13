import {
  AsyncPipe,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';
import {
  APP_CONFIG,
  AppConfig,
} from 'src/config/app-config.interface';

import { RemoteData } from '../../../core/data/remote-data';
import { SearchService } from '../../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { SearchFilterService } from '../../../core/shared/search/search-filter.service';
import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-configuration.service';
import { hasValue } from '../../empty.util';
import { currentPath } from '../../utils/route.utils';
import { AdvancedSearchComponent } from '../advanced-search/advanced-search.component';
import { PaginatedSearchOptions } from '../models/paginated-search-options.model';
import { SearchFilterConfig } from '../models/search-filter-config.model';
import { SearchFilterComponent } from './search-filter/search-filter.component';

@Component({
  selector: 'ds-search-filters',
  styleUrls: ['./search-filters.component.scss'],
  templateUrl: './search-filters.component.html',
  standalone: true,
  imports: [NgIf, NgFor, SearchFilterComponent, RouterLink, AsyncPipe, TranslateModule, AdvancedSearchComponent],
})

/**
 * This component represents the part of the search sidebar that contains filters.
 */
export class SearchFiltersComponent implements OnInit, OnDestroy {
  /**
   * An observable containing configuration about which filters are shown and how they are shown
   */
  @Input() filters: Observable<RemoteData<SearchFilterConfig[]>>;
  @Input() searchOptions: PaginatedSearchOptions;
  /**
   * List of all filters that are currently active with their value set to null.
   * Used to reset all filters at once
   */
  clearParams;

  /**
   * The configuration to use for the search options
   */
  @Input() currentConfiguration;

  /**
   * The current search scope
   */
  @Input() currentScope: string;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

  /**
   * Emits when the search filters values may be stale, and so they must be refreshed.
   */
  @Input() refreshFilters: BehaviorSubject<boolean>;

  /**
   * Link to the search page
   */
  searchLink: string;

  subs = [];
  filterLabel = 'search';

  /**
   * Initialize instance variables
   * @param {SearchService} searchService
   * @param {SearchFilterService} filterService
   * @param {Router} router
   * @param {SearchConfigurationService} searchConfigService
   */
  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    private searchService: SearchService,
    private filterService: SearchFilterService,
    private router: Router,
    @Inject(SEARCH_CONFIG_SERVICE) private searchConfigService: SearchConfigurationService) {
  }

  ngOnInit(): void {
    if (!this.inPlaceSearch) {
      this.filterLabel = 'discover';
    }
    this.clearParams = this.searchConfigService.getCurrentFrontendFilters().pipe(map((filters) => {
      Object.keys(filters).forEach((f) => filters[f] = null);
      return filters;
    }));
    this.searchLink = this.getSearchLink();
  }

  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  getSearchLink(): string {
    if (this.inPlaceSearch) {
      return currentPath(this.router);
    }
    return this.searchService.getSearchLink();
  }

  /**
   * Prevent unnecessary rerendering
   */
  trackUpdate(index, config: SearchFilterConfig) {
    return config ? config.name : undefined;
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => {
      if (hasValue(sub)) {
        sub.unsubscribe();
      }
    });
  }
}
