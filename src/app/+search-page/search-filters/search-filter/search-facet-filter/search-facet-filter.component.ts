import { Component, Input, OnInit } from '@angular/core';
import { FacetValue } from '../../../search-service/facet-value.model';
import { SearchFilterConfig } from '../../../search-service/search-filter-config.model';
import { Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SearchFilterService } from '../search-filter.service';
import { isNotEmpty } from '../../../../shared/empty.util';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-facet-filter',
  styleUrls: ['./search-facet-filter.component.scss'],
  templateUrl: './search-facet-filter.component.html',
})

export class SearchFacetFilterComponent implements OnInit {
  @Input() filterValues: FacetValue[];
  @Input() filterConfig: SearchFilterConfig;
  @Input() selectedValues: string[];
  currentPage: Observable<number>;
  filter: string;

  constructor(private filterService: SearchFilterService, private router: Router) {
  }

  ngOnInit(): void {
    this.currentPage = this.filterService.getPage(this.filterConfig.name);
  }

  isChecked(value: FacetValue): Observable<boolean> {
    return this.filterService.isFilterActiveWithValue(this.filterConfig.paramName, value.label);
  }

  getSearchLink() {
    return this.filterService.searchLink;
  }

  getQueryParamsWith(value: string): Observable<Params> {
    return this.filterService.getQueryParamsWith(this.filterConfig, value);
  }

  getQueryParamsWithout(value: string): Observable<Params> {
    return this.filterService.getQueryParamsWithout(this.filterConfig, value);
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

  getCurrentUrl() {
    return this.router.url;
  }

  getFilters(): FacetValue[] {
    // filter selected values
    return this.filterValues.filter((value: FacetValue) => !this.selectedValues.includes(value.label))
  }

  onSubmit(data: any) {
    if (isNotEmpty(data)) {
      const sub = this.getQueryParamsWith(data[this.filterConfig.paramName]).first().subscribe((params) => {
          this.router.navigate([this.getSearchLink()], { queryParams: params }
          );
        }
      );
      this.filter = '';
      sub.unsubscribe();
    }
  }
}
