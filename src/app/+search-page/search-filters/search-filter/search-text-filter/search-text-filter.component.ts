import { Component, OnInit } from '@angular/core';
import { FacetValue } from '../../../search-service/facet-value.model';
import { Observable } from 'rxjs/Observable';
import { FilterType } from '../../../search-service/filter-type.model';
import { renderFacetFor } from '../search-filter-type-decorator';
import { SearchFacetFilterComponent } from '../search-facet-filter/search-facet-filter.component';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-text-filter',
  styleUrls: ['./search-text-filter.component.scss'],
  templateUrl: './search-text-filter.component.html',
})

@renderFacetFor(FilterType.text)
export class SearchTextFilterComponent extends SearchFacetFilterComponent implements OnInit {
  currentPage: Observable<number>;

  ngOnInit(): void {
    this.currentPage = this.filterService.getPage(this.filterConfig.name);
  }

  isChecked(value: FacetValue): Observable<boolean> {
    return this.filterService.isFilterActiveWithValue(this.filterConfig.paramName, value.value);
  }

  get facetCount(): Observable<number> {
    const resultCount = this.filterValues.length;
    return this.currentPage.map((page: number) => {
      const max = page * this.filterConfig.pageSize;
      return max > resultCount ? resultCount : max;
    });
  }

  showMore() {
    this.filterService.incrementPage(this.filterConfig.name);
  }

  showFirstPageOnly() {
    this.filterService.resetPage(this.filterConfig.name);
  }

  getCurrentPage(): Observable<number> {
    return this.filterService.getPage(this.filterConfig.name);
  }
}
