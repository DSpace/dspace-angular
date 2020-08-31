import { Component, OnInit, Input } from '@angular/core';
import { FacetSection } from 'src/app/core/layout/models/section.model';
import { SearchService } from 'src/app/core/shared/search/search.service';
import { getFirstSucceededRemoteDataPayload, getFirstSucceededRemoteListPayload } from 'src/app/core/shared/operators';
import { map, tap } from 'rxjs/operators';
import { SearchFilterConfig } from 'src/app/shared/search/search-filter-config.model';
import { observable, combineLatest, Observable, BehaviorSubject } from 'rxjs';
import { SearchOptions } from 'src/app/shared/search/search-options.model';
import { FacetValue } from 'src/app/shared/search/facet-value.model';

/**
 * Component representing the Facet component section.
 */
@Component({
    selector: 'ds-facet-section',
    templateUrl: './facet-section.component.html'
})
export class FacetSectionComponent implements OnInit {

    @Input()
    sectionId: string;

    @Input()
    facetSection: FacetSection;

    discoveryConfiguration: string;

    facets: Facet[] = [];
    facets$ = new BehaviorSubject(this.facets);

    constructor(public searchService: SearchService) {

    }

    ngOnInit() {
        this.discoveryConfiguration = this.facetSection.discoveryConfigurationName;
        this.searchService.searchFacets(null, this.discoveryConfiguration)
            .pipe( getFirstSucceededRemoteDataPayload() )
            .subscribe((facetConfigs) => this.setupFacets(facetConfigs));
    }

    /**
     * Setup the facets starting from the search filter configurations.
     *
     * @param facetConfigs the search filter configurations
     */
    setupFacets( facetConfigs: SearchFilterConfig[] ) {
        const subs = facetConfigs
            .map((facetConfig) => this.searchService.getFacetValuesFor(facetConfig, 1,new SearchOptions({configuration: this.discoveryConfiguration})))
            .map ( (obs) => obs.pipe(getFirstSucceededRemoteListPayload()));

        combineLatest(subs)
            .subscribe( (facetValues) => {
                for ( const facetValue of facetValues) {
                    const config = facetConfigs[facetValues.indexOf(facetValue)];
                    this.facets.push({
                        config: config,
                        values: facetValue
                    })
                    this.facets$.next(this.facets);
                }
            });
    }

    /**
     * Returns the queryParams for the search related to the given facet.
     *
     * @param facet the facet
     * @param value the facet value
     */
    getSearchQueryParams(facet: Facet, value: string) {
        const queryParams = {
            configuration: this.facetSection.discoveryConfigurationName,
            page: 1
        };
        if ( facet.config.type === 'date') {
            const dates = value.split('-');
            if ( dates.length === 2) {
                queryParams[facet.config.paramName + '.min'] = dates[0].trim();
                queryParams[facet.config.paramName + '.max'] = dates[1].trim();
            } else {
                queryParams[facet.config.paramName] = dates[0].trim();
            }
        } else {
            queryParams[facet.config.paramName] = value;
        }
        return queryParams;
    }

}

/**
 * A facet configuration with it's values.
 */
interface Facet {
    config: SearchFilterConfig;
    values: FacetValue[];
}
