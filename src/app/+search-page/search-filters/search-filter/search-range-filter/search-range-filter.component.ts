import { Component, Inject, OnInit } from '@angular/core';
import { FilterType } from '../../../search-service/filter-type.model';
import { renderFacetFor } from '../search-filter-type-decorator';
import { SearchFacetFilterComponent } from '../search-facet-filter/search-facet-filter.component';
import { isNotEmpty } from '../../../../shared/empty.util';
import { SearchFilterConfig } from '../../../search-service/search-filter-config.model';
import { FILTER_CONFIG, SearchFilterService, SELECTED_VALUES } from '../search-filter.service';
import { SearchService } from '../../../search-service/search.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

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
  max = 2018;
  range;
  dateFormats = ['YYYY', 'YYYY-MM', 'YYYY-MM-DD']

  constructor(protected searchService: SearchService,
              protected filterService: SearchFilterService,
              protected router: Router,
              @Inject(FILTER_CONFIG) public filterConfig: SearchFilterConfig,
              @Inject(SELECTED_VALUES) public selectedValues: string[],
              private route: ActivatedRoute) {
    super(searchService, filterService, router, filterConfig, selectedValues);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.min = moment(this.filterConfig.minValue, this.dateFormats).year() || this.min;
    this.max = moment(this.filterConfig.maxValue, this.dateFormats).year() || this.max;
    const iniMin = this.route.snapshot.queryParams[this.filterConfig.paramName + '.min'] || this.min;
    const iniMax = this.route.snapshot.queryParams[this.filterConfig.paramName + '.max'] || this.max;
    this.range = [iniMin, iniMax];

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
          {
            [this.filterConfig.paramName + '.min']: [data[this.filterConfig.paramName + '.min']],
            [this.filterConfig.paramName + '.max']: [data[this.filterConfig.paramName + '.max']]
          },
        queryParamsHandling: 'merge'
      });
      this.filter = '';
    }
  }

}
