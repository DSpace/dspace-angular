import { Component, Input } from '@angular/core';
import { SearchService } from '../search-service/search.service';
import { Observable } from 'rxjs/Observable';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-filters',
  styleUrls: ['./search-filters.component.scss'],
  templateUrl: './search-filters.component.html',
})

export class SidebarFiltersComponent {
  @Input() filters;
  constructor(private searchService: SearchService) {}

  getClearFiltersLink(): Observable<string> {
    return this.searchService.getClearFiltersLink();
  }
}
