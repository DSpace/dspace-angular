import { Component, Input, OnInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { FacetSection } from '../../../../core/layout/models/section.model';
import { getFirstSucceededRemoteDataPayload } from '../../../../core/shared/operators';
import { SearchService } from '../../../../core/shared/search/search.service';
import { SearchFilterConfig } from '../../../search/models/search-filter-config.model';
import { FilterType } from '../../../search/models/filter-type.model';
import { FacetValue } from '../../../search/models/facet-value.model';
import { getFacetValueForTypeAndLabel } from '../../../search/search.utils';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';

/**
 * Component representing the Facet component section.
 */
@Component({
  selector: 'ds-facet-section',
  templateUrl: './facet-section.component.html',
})
export class FacetSectionComponent implements OnInit {

  @Input()
  sectionId: string;

  @Input()
  facetSection: FacetSection;

  discoveryConfiguration: string;

  facets: SearchFilterConfig[] = [];
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
      page: 1
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
    if (facet.filterType.includes('chart')) {
      return 'col-12 col-lg-6';
    }
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
