import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Params,
  Router,
  RouterLink,
} from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PaginationService } from '../../../../../../core/pagination/pagination.service';
import { SearchService } from '../../../../../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../../../../../core/shared/search/search-configuration.service';
import { SearchFilterService } from '../../../../../../core/shared/search/search-filter.service';
import { LiveRegionService } from '../../../../../../shared/live-region/live-region.service';
import { CapitalizePipe } from '../../../../../utils/capitalize.pipe';
import { currentPath } from '../../../../../utils/route.utils';
import { ShortNumberPipe } from '../../../../../utils/short-number.pipe';
import { FacetValue } from '../../../../models/facet-value.model';
import { SearchFilterConfig } from '../../../../models/search-filter-config.model';
import { getFacetValueForType } from '../../../../search.utils';

@Component({
  selector: 'ds-search-facet-option',
  styleUrls: ['./search-facet-option.component.scss'],
  templateUrl: './search-facet-option.component.html',
  standalone: true,
  imports: [NgIf, RouterLink, AsyncPipe, TranslateModule, ShortNumberPipe, CapitalizePipe],
})

/**
 * Represents a single option in a filter facet
 */
export class SearchFacetOptionComponent implements OnInit {
  /**
   * A single value for this component
   */
  @Input() filterValue: FacetValue;

  /**
   * The filter configuration for this facet option
   */
  @Input() filterConfig: SearchFilterConfig;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch: boolean;

  /**
   * Emits true when this option should be visible and false when it should be invisible
   */
  isVisible: Observable<boolean>;

  /**
   * UI parameters when this filter is added
   */
  addQueryParams$: Observable<Params>;

  /**
   * Link to the search page
   */
  searchLink: string;

  paginationId: string;

  configuration: string;
  labelTranslation: string;

  constructor(protected searchService: SearchService,
              protected filterService: SearchFilterService,
              protected searchConfigService: SearchConfigurationService,
              protected router: Router,
              protected activatedRoute: ActivatedRoute,
              protected paginationService: PaginationService,
              protected liveRegionService: LiveRegionService,
              protected translateService: TranslateService,
  ) {
  }

  /**
   * Initializes all observable instance variables and starts listening to them
   */
  ngOnInit(): void {
    this.configuration = this.activatedRoute?.snapshot?.queryParams?.configuration;

    this.handleTranslation();

    this.paginationId = this.searchConfigService.paginationID;
    this.searchLink = this.getSearchLink();
    this.isVisible = this.isChecked().pipe(map((checked: boolean) => !checked));
    this.addQueryParams$ = this.updateAddParams();
  }

  /**
   * Handles translation of the label
   */
  handleTranslation() {
    let translation = '';
    const labelWithConfiguration = `search.filters.${this.configuration}.${this.filterConfig.name}.${this.filterValue.value}`;

    translation = this.translateService.instant(labelWithConfiguration);
    if (translation !== labelWithConfiguration) {
      this.labelTranslation = translation;
    } else {
      const labelWithoutConfiguration = `search.filters.${this.filterConfig.name}.${this.filterValue.value}`;
      translation = this.translateService.instant(labelWithoutConfiguration);
      if (translation !== labelWithoutConfiguration) {
        this.labelTranslation = translation;
      } else {
        this.labelTranslation = this.filterValue.value;
      }
    }
  }

  /**
   * Checks if a value for this filter is currently active
   */
  isChecked(): Observable<boolean> {
    return this.filterService.isFilterActiveWithValue(this.filterConfig.paramName, this.getFacetValue());
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
   * Calculates the parameters that should change if this {@link filterValue} would be added to the active filters
   */
  updateAddParams(): Observable<Params> {
    return this.searchConfigService.selectNewAppliedFilterParams(this.filterConfig.name, this.getFacetValue());
  }

  /**
   * Retrieve facet value related to facet type
   */
  getFacetValue(): string {
    return getFacetValueForType(this.filterValue, this.filterConfig);
  }

  /**
   * Announces to the screen reader that the page will be reloaded, which filter has been selected
   */
  announceFilter() {
    const message = this.translateService.instant('search-facet-option.update.announcement', { filter: this.filterValue.value });
    this.liveRegionService.addMessage(message);
  }
}
