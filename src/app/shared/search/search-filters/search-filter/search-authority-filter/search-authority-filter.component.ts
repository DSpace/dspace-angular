import { Component, OnInit } from '@angular/core';
import { FilterType } from '../../../models/filter-type.model';
import { facetLoad, SearchFacetFilterComponent } from '../search-facet-filter/search-facet-filter.component';
import { renderFacetFor } from '../search-filter-type-decorator';
import { addOperatorToFilterValue } from '../../../search.utils';

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
   * Submits a selected filter value to the filter
   * Adds the "authority" operator to the received data before passing it on
   * @param data The string selected from input suggestions
   */
  onClick(data: any) {
    this.applyFilterValue(addOperatorToFilterValue(data, 'authority'));
  }
}
