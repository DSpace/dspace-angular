import { Component, OnInit } from '@angular/core';
import { FilterType } from '../../../search-service/filter-type.model';
import { renderFacetFor } from '../search-filter-type-decorator';
import {
  facetLoad,
  SearchFacetFilterComponent
} from '../search-facet-filter/search-facet-filter.component';

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
}
