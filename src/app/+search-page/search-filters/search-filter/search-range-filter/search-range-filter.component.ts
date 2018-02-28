import { Component } from '@angular/core';
import { FilterType } from '../../../search-service/filter-type.model';
import { renderFacetFor } from '../search-filter-type-decorator';
import { SearchFacetFilterComponent } from '../search-facet-filter/search-facet-filter.component';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-range-filter',
  styleUrls: ['./search-range-filter.component.scss'],
  templateUrl: './search-range-filter.component.html',
})

@renderFacetFor(FilterType.range)
export class SearchRangeFilterComponent extends SearchFacetFilterComponent {
  min = 1950;
  max = 1960;
  rangeMin = 1900; // calculate using available values
  rangeMax = 2000;

  get range() {
    return [this.min, this.max];
  }

  set range(value: number[]) {
    this.min = value[0];
    this.max = value[1];
  }
}
