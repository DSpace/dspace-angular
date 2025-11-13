import { AsyncPipe } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { PaginationService } from '@dspace/core/pagination/pagination.service';
import { PaginationComponentOptions } from '@dspace/core/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { Observable } from 'rxjs';
import {
  map,
  take,
} from 'rxjs/operators';

import { SEARCH_CONFIG_SERVICE } from '../../my-dspace-page/my-dspace-configuration.service';
import { SearchConfigurationService } from '../search/search-configuration.service';
import { SidebarDropdownComponent } from '../sidebar/sidebar-dropdown.component';

@Component({
  selector: 'ds-page-size-selector',
  styleUrls: ['./page-size-selector.component.scss'],
  templateUrl: './page-size-selector.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    SidebarDropdownComponent,
  ],
})

/**
 * This component represents the part of the search sidebar that contains the page size settings.
 */
export class PageSizeSelectorComponent implements OnInit {
  /**
   * The configuration for the current paginated search results
   */
  paginationOptions$: Observable<PaginationComponentOptions>;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private paginationService: PaginationService,
              @Inject(SEARCH_CONFIG_SERVICE) public searchConfigurationService: SearchConfigurationService) {
  }

  /**
   * Initialize paginated search options
   */
  ngOnInit(): void {
    this.paginationOptions$ = this.searchConfigurationService.paginatedSearchOptions.pipe(map((options: PaginatedSearchOptions) => options.pagination));
  }

  /**
   * Method to change the current page size (results per page)
   * @param {Event} event Change event containing the new page size value
   */
  reloadRPP(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.paginationOptions$.pipe(
      take(1),
    ).subscribe((pagination: PaginationComponentOptions) => {
      this.paginationService.updateRoute(pagination.id, { page: 1, pageSize: +value });
    }) ;
  }
}
