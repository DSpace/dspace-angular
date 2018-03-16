import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SearchService } from '../search-service/search.service';
import { SearchOptions, ViewMode } from '../search-options.model';
import { SortDirection } from '../../core/cache/models/sort-options.model';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'ds-search-settings',
  styleUrls: ['./search-settings.component.scss'],
  templateUrl: './search-settings.component.html'
})
export class SearchSettingsComponent implements OnInit {

  @Input() searchOptions: SearchOptions;
  /**
   * Declare SortDirection enumeration to use it in the template
   */
  public sortDirections = SortDirection;
  /**
   * Number of items per page.
   */
  public pageSize;
  @Input() public pageSizeOptions;
  public listPageSizeOptions: number[] = [5, 10, 20, 40, 60, 80, 100];
  public gridPageSizeOptions: number[] = [12, 24, 36, 48 , 50, 62, 74, 84];

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
        if (params.view === ViewMode.Grid) {
          this.pageSizeOptions = this.gridPageSizeOptions;
        } else {
          this.pageSizeOptions = this.listPageSizeOptions;
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
    this.router.navigate([ this.service.getSearchLink() ], navigationExtras);
  }

  reloadOrder(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const navigationExtras: NavigationExtras = {
      queryParams: Object.assign({}, this.currentParams, {
        sortDirection: value
      })
    };
    this.router.navigate([ this.service.getSearchLink() ], navigationExtras);
  }
}
