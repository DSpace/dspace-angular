import { Component, Inject, Input, OnInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { FacetSection } from '../../../../core/layout/models/section.model';
import { getFirstSucceededRemoteDataPayload } from '../../../../core/shared/operators';
import { SearchService } from '../../../../core/shared/search/search.service';
import { SearchFilterConfig } from '../../../search/models/search-filter-config.model';
import { FilterType } from '../../../search/models/filter-type.model';
import { FacetValue } from '../../../search/models/facet-value.model';
import { getFacetValueForTypeAndLabel } from '../../../search/search.utils';
import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';

/**
 * Component representing the Facet component section.
 */
@Component({
    selector: 'ds-facet-section',
    templateUrl: './facet-section.component.html',
    providers: [
        {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})
export class FacetSectionComponent implements OnInit {

    @Input()
    sectionId: string;

    @Input()
    facetSection: FacetSection;

    discoveryConfiguration: string;

    facets: SearchFilterConfig[] = [];
    facets$ = new BehaviorSubject(this.facets);

    constructor(public searchService: SearchService,
                @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
    ) {

    }

    ngOnInit() {
      this.discoveryConfiguration = this.facetSection.discoveryConfigurationName;
      this.searchService.searchFacets(null, this.discoveryConfiguration)
        .pipe( getFirstSucceededRemoteDataPayload() )
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
        if ( this.isRangeFacet(facet.filterType, facetValue.label)) {
            const dates = facetValue.label.split('-');
            queryParams[facet.paramName + '.min'] = dates[0].trim();
            queryParams[facet.paramName + '.max'] = dates[1].trim();
            return;
        }
        queryParams[facet.paramName] = getFacetValueForTypeAndLabel(facetValue, facet);
    }

    private isRangeFacet(filterType: FilterType, value: string) {
        return filterType === FilterType.range && value.split('-').length === 2;
    }

    getFacetsBoxCol(facet) {
        if (facet.filterType.includes('chart')) {
          return 6;
       }
        const facetsPerRow = this.facetSection.facetsPerRow ? this.facetSection.facetsPerRow : 4;
        return 12 / facetsPerRow;
    }

}
