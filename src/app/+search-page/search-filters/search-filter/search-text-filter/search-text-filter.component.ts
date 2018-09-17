import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FilterType } from '../../../search-service/filter-type.model';
import {
  facetLoad,
  SearchFacetFilterComponent
} from '../search-facet-filter/search-facet-filter.component';
import { renderFacetFor } from '../search-filter-type-decorator';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-text-filter',
  styleUrls: ['./search-text-filter.component.scss'],
  templateUrl: './search-text-filter.component.html',
  animations: [facetLoad]
})

/**
 * Component that represents a text facet for a specific filter configuration
 */
@renderFacetFor(FilterType.text)
export class SearchTextFilterComponent extends SearchFacetFilterComponent implements OnInit {
}
