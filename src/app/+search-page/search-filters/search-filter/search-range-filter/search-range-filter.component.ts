import { Component, OnInit } from '@angular/core';
import { FilterType } from '../../../search-service/filter-type.model';
import { renderFacetFor } from '../search-filter-type-decorator';
import { SearchFacetFilterComponent } from '../search-facet-filter/search-facet-filter.component';
import { isNotEmpty } from '../../../../shared/empty.util';

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
export class SearchRangeFilterComponent extends SearchFacetFilterComponent implements OnInit {
  rangeDelimiter = '-';
  min = 1950;
  max = 1960;
  rangeMin = 1900; // calculate using available values
  rangeMax = 2000;

  ngOnInit(): void {

  }
  get range() {
    return [this.min, this.max];
  }

  set range(value: number[]) {
    this.min = value[0];
    this.max = value[1];
  }

  getAddParams(value: string) {
    const parts = value.split(this.rangeDelimiter);
    const min = parts.length > 1 ? parts[0].trim() : value;
    const max = parts.length > 1 ? parts[1].trim() : value;
    return {
      [this.filterConfig.paramName + '.min']: [min],
      [this.filterConfig.paramName + '.max']: [max],
      page: 1
    };
  }

  getRemoveParams(value: string) {
    return {
      [this.filterConfig.paramName + '.min']: null,
      [this.filterConfig.paramName + '.max']: null,
      page: 1
    };
  }

  onSubmit(data: any) {
    if (isNotEmpty(data)) {
      this.router.navigate([this.getSearchLink()], {
        queryParams:
          { [this.filterConfig.paramName + '.min']: [data[this.filterConfig.paramName + '.min']],
            [this.filterConfig.paramName + '.max']: [data[this.filterConfig.paramName + '.max']]},
        queryParamsHandling: 'merge'
      });
      this.filter = '';
    }
  }

}
