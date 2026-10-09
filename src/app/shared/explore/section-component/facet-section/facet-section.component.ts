import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FacetSection } from '@dspace/core/layout/models/section.model';
import { getFirstSucceededRemoteDataPayload } from '@dspace/core/shared/operators';
import { FacetValue } from '@dspace/core/shared/search/models/facet-value.model';
import { FilterType } from '@dspace/core/shared/search/models/filter-type.model';
import { SearchFilterConfig } from '@dspace/core/shared/search/models/search-filter-config.model';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { SearchService } from '../../../search/search.service';
import { getFacetValueForTypeAndLabel } from '../../../search/search.utils';
import { SearchConfigurationService } from '../../../search/search-configuration.service';


/**
 * Component representing the Facet component section.
 */
@Component({
  selector: 'ds-base-facet-section',
  templateUrl: './facet-section.component.html',
  imports: [
    AsyncPipe,
    RouterLink,
    TranslateModule,
  ],
})
export class FacetSectionComponent implements OnInit {

  /** Unique identifier for this section instance. */
  @Input()
    sectionId: string;

  /** Configuration object defining the facet display settings. */
  @Input()
    facetSection: FacetSection;

  /** The discovery configuration name used to fetch facets. */
  discoveryConfiguration: string;

  /** Array of loaded search filter configs that have at least one facet value. */
  facets: SearchFilterConfig[] = [];

  /** Subject emitting the current facets array as new facets are loaded. */
  facets$ = new BehaviorSubject(this.facets);

  constructor(
    private searchConfigService: SearchConfigurationService,
    private searchService: SearchService,
  ) {

  }

  ngOnInit() {
    this.discoveryConfiguration = this.facetSection.discoveryConfigurationName;
    this.searchConfigService.searchFacets(null, this.discoveryConfiguration)
      .pipe(getFirstSucceededRemoteDataPayload())
      .subscribe((facetConfigs) => {
        for (const config of facetConfigs) {
          if (config._embedded.values.length > 0) {
            this.facets.push(config);
            this.facets$.next(this.facets);
          }
        }
      });
  }

  /**
   * Returns the queryParams for the search related to the given facet.
   *
   * @param facet the facet
   * @param facetValue the FacetValue
   */
  getSearchQueryParams(facet: SearchFilterConfig, facetValue: FacetValue) {
    const queryParams = {
      configuration: this.facetSection.discoveryConfigurationName,
      page: 1,
    };
    this.addFacetValuesToQueryParams(facet, facetValue, queryParams);
    return queryParams;
  }

  private addFacetValuesToQueryParams(facet: SearchFilterConfig, facetValue: FacetValue, queryParams) {
    if (this.isRangeFacet(facet.filterType, facetValue.label)) {
      const dates = facetValue.label.split('-');
      queryParams[facet.paramName + '.min'] = dates[0].trim();
      queryParams[facet.paramName + '.max'] = dates[1].trim();
      return;
    }
    queryParams[facet.paramName] = getFacetValueForTypeAndLabel(facetValue, facet);
  }

  /**
   * Return the appropriate col-* classes for the facet, based on the number of facets per row
   * @param facet
   */
  getFacetsBoxCol(facet) {
    const facetsPerRow = this.facetSection.facetsPerRow ? this.facetSection.facetsPerRow : 4;
    const colSizeLg = Math.min(Math.ceil(12 / facetsPerRow), 12);
    const colSizeMd = Math.min(Math.ceil(12 / facetsPerRow * 2), 12); // double width on medium screens

    return `col-12 col-md-${colSizeMd} col-lg-${colSizeLg}`;
  }

  /**
   * Return the search page link
   */
  getSearchLink(): string[] {
    return [this.searchService.getSearchLink()];
  }

  private isRangeFacet(filterType: FilterType, value: string) {
    return filterType === FilterType.range && value.split('-').length === 2;
  }
}
