import { Component, OnInit } from '@angular/core';

import { FilterType } from '../../../filter-type.model';
import { facetLoad, SearchFacetFilterComponent } from '../search-facet-filter/search-facet-filter.component';
import { renderFacetFor } from '../search-filter-type-decorator';
import { FacetValue } from '../../../facet-value.model';

@Component({
  selector: 'ds-search-authority-filter',
  styleUrls: ['./search-authority-filter.component.scss'],
  templateUrl: './search-authority-filter.component.html',
  animations: [facetLoad]
})

/**
 * Component that represents an authority facet for a specific filter configuration
 */
@renderFacetFor(FilterType.authority)
export class SearchAuthorityFilterComponent extends SearchFacetFilterComponent implements OnInit {

  /**
   * TODO to review after https://github.com/DSpace/dspace-angular/issues/368 is resolved
   * Retrieve facet value from search link
   */
  protected getFacetValue(facet: FacetValue): string {
    const search = facet._links.search.href;
    const hashes = search.slice(search.indexOf('?') + 1).split('&');
    const params = {};
    hashes.map((hash) => {
      const [key, val] = hash.split('=');
      params[key] = decodeURIComponent(val)
    });

    return params[this.filterConfig.paramName];
  }
}
