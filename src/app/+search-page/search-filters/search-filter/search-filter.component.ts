import { Component, Input, OnInit } from '@angular/core';
import { SearchFilterConfig } from '../../search-service/search-filter-config.model';
import { SearchService } from '../../search-service/search.service';
import { RemoteData } from '../../../core/data/remote-data';
import { FacetValue } from '../../search-service/facet-value.model';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-filter',
  styleUrls: ['./search-filter.component.scss'],
  templateUrl: './search-filter.component.html',
})

export class SidebarFilterComponent implements OnInit {
  @Input() filter: SearchFilterConfig;
  filterValues: RemoteData<FacetValue[]>;
  isCollapsed = false;

  constructor(private searchService: SearchService) {
  }

  ngOnInit() {
    this.filterValues = this.searchService.getFacetValuesFor(this.filter.name);
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }
}