import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SetViewMode } from '../../shared/view-mode';
import { SearchService } from '../search-service/search.service';
import { SearchOptions} from '../search-options.model';
import { SortDirection } from '../../core/cache/models/sort-options.model';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { PaginatedSearchOptions } from '../paginated-search-options.model';

@Component({
  selector: 'ds-search-settings',
  styleUrls: ['./search-settings.component.scss'],
  templateUrl: './search-settings.component.html'
})
export class SearchSettingsComponent implements OnInit {

  @Input() searchOptions: PaginatedSearchOptions;
  /**
   * Declare SortDirection enumeration to use it in the template
   */
  public sortDirections = SortDirection;
  /**
   * Number of items per page.
   */
  public pageSize;
  @Input() public pageSizeOptions;

  private sub;
  private scope: string;
  query: string;
  page: number;
  direction: SortDirection;
  currentParams = {};

  constructor(private service: SearchService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.searchOptions = this.service.searchOptions;
    this.pageSize = this.searchOptions.pagination.pageSize;
    this.pageSizeOptions = this.searchOptions.pagination.pageSizeOptions;
    this.sub = this.route
      .queryParams
      .subscribe((params) => {
        this.currentParams = params;
        this.query = params.query || '';
        this.scope = params.scope;
        this.page  = +params.page || this.searchOptions.pagination.currentPage;
        this.pageSize = +params.pageSize || this.searchOptions.pagination.pageSize;
        this.direction = params.sortDirection || this.searchOptions.sort.direction;
        if (params.view === SetViewMode.Grid) {
          this.pageSizeOptions = this.pageSizeOptions;
        } else {
          this.pageSizeOptions = this.pageSizeOptions;
        }
      });
  }

  reloadRPP(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const navigationExtras: NavigationExtras = {
      queryParams: Object.assign({}, this.currentParams, {
        pageSize: value
      })
    };
    this.router.navigate([ '/search' ], navigationExtras);
  }

  reloadOrder(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const navigationExtras: NavigationExtras = {
      queryParams: Object.assign({}, this.currentParams, {
        sortDirection: value
      })
    };
    this.router.navigate([ '/search' ], navigationExtras);
  }
}
