import { Component, Input, OnInit } from '@angular/core';
import { SearchFilterConfig } from '../../search-service/search-filter-config.model';
import { SearchService } from '../../search-service/search.service';
import { RemoteData } from '../../../core/data/remote-data';
import { FacetValue } from '../../search-service/facet-value.model';
import { SearchFilterService } from './search-filter.service';
import { Observable } from 'rxjs/Observable';
import { slide } from '../../../shared/animations/slide';
import { PaginatedList } from '../../../core/data/paginated-list';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-filter',
  styleUrls: ['./search-filter.component.scss'],
  templateUrl: './search-filter.component.html',
  animations: [slide],
})

export class SearchFilterComponent implements OnInit {
  @Input() filter: SearchFilterConfig;

  constructor(private filterService: SearchFilterService) {
  }

  ngOnInit() {
    const sub = this.filterService.isFilterActive(this.filter.paramName).first().subscribe((isActive) => {
      if (this.filter.isOpenByDefault || isActive) {
        this.initialExpand();
      } else {
        this.initialCollapse();
      }
    });
    sub.unsubscribe();
  }

  toggle() {
    this.filterService.toggle(this.filter.name);
  }

  isCollapsed(): Observable<boolean> {
    return this.filterService.isCollapsed(this.filter.name);
  }

  initialCollapse() {
    this.filterService.initialCollapse(this.filter.name);
  }

  initialExpand() {
    this.filterService.initialExpand(this.filter.name);
  }

  getSelectedValues(): Observable<string[]> {
    return this.filterService.getSelectedValuesForFilter(this.filter);
  }
}
