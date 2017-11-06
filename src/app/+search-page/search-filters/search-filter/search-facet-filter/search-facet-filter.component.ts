import { Component, Input } from '@angular/core';
import { FacetValue } from '../../../search-service/facet-value.model';
import { SearchFilterConfig } from '../../../search-service/search-filter-config.model';
import { SearchService } from '../../../search-service/search.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

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

export class SidebarFacetFilterComponent {
  @Input() filterValues: FacetValue[];
  @Input() filterConfig: SearchFilterConfig;

  constructor(private searchService: SearchService, private route: ActivatedRoute) {
  }

  isChecked(value: FacetValue) {
    return this.searchService.isFilterActive(this.filterConfig.name, value.value);
  }

  getSearchLink() {
    return this.searchService.getSearchLink();
  }

  getQueryParams(value: FacetValue): Observable<any> {
    const params = {};
    params[this.filterConfig.paramName] = value.value;
    return this.route.queryParams.map((p) => Object.assign({}, p, params))
  }

}
