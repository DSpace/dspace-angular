import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FilterType } from '../../../search-service/filter-type.model';
import { renderFacetFor } from '../search-filter-type-decorator';
import {
  facetLoad,
  SearchFacetFilterComponent
} from '../search-facet-filter/search-facet-filter.component';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-boolean-filter',
  styleUrls: ['./search-boolean-filter.component.scss'],
  templateUrl: './search-boolean-filter.component.html',
  animations: [facetLoad]
})

@renderFacetFor(FilterType.boolean)
export class SearchBooleanFilterComponent extends SearchFacetFilterComponent implements OnInit {
}
