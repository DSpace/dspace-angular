import { Component, OnInit } from '@angular/core';
import { FilterType } from '../../../models/filter-type.model';
import { renderFacetFor } from '../search-filter-type-decorator';
import { facetLoad, SearchFacetFilterComponent } from '../search-facet-filter/search-facet-filter.component';
import { addOperatorToFilterValue } from '../../../search.utils';

@Component({
  selector: 'ds-search-hierarchy-filter',
  styleUrls: ['./search-hierarchy-filter.component.scss'],
  templateUrl: './search-hierarchy-filter.component.html',
  animations: [facetLoad]
})

/**
 * Component that represents a hierarchy facet for a specific filter configuration
 */
@renderFacetFor(FilterType.hierarchy)
export class SearchHierarchyFilterComponent extends SearchFacetFilterComponent implements OnInit {
  /**
   * Submits a new active custom value to the filter from the input field
   * Overwritten method from parent component, adds the "query" operator to the received data before passing it on
   * @param data The string from the input field
   */
  onSubmit(data: any) {
    super.onSubmit(addOperatorToFilterValue(data, 'query'));
  }
}
