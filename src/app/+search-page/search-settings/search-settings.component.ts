import { Component, Input, OnInit } from '@angular/core';
import { SearchService } from '../search-service/search.service';
import { SearchOptions } from '../search-options.model';
import { SortDirection } from '../../core/cache/models/sort-options.model';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'ds-search-settings',
  styleUrls: ['./search-settings.component.scss'],
  templateUrl: './search-settings.component.html',
})
export class SearchSettingsComponent implements OnInit{

  @Input() searchOptions: SearchOptions;
  /**
   * Declare SortDirection enumeration to use it in the template
   */
  public sortDirections = SortDirection;
  /**
   * Number of items per page.
   */
  public pageSize;

  private sub;
  private scope: string;
  query: string;
  page: number;
  direction: SortDirection;
  currentParams = {};

  constructor(private service: SearchService,
              private route: ActivatedRoute,
              private router: Router){

  }

  ngOnInit(): void {
    this.searchOptions = this.service.searchOptions;
    this.pageSize = this.searchOptions.pagination.pageSize;
    this.sub = this.route
      .queryParams
      .subscribe((params) => {
        this.currentParams = params;
        this.query = params.query || '';
        this.scope = params.scope;
        this.page  = +params.page || this.searchOptions.pagination.currentPage;
        this.pageSize = +params.pageSize || this.searchOptions.pagination.pageSize;
        this.direction = +params.sortDirection || this.searchOptions.sort.direction;
      });
  }
  reloadRPP(event:Event) {
    let value = (<HTMLInputElement>event.target).value;
    this.searchOptions.sort.direction;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        query:this.query,
        pageSize:value,
        scope: this.scope,
        page:this.page,
        sortDirection:this.direction
      }
    };
    this.router.navigate(['/search'], navigationExtras);
  }

  reloadOrder(event:Event) {
    let value = (<HTMLInputElement>event.target).value;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        query:this.query,
        pageSize:this.pageSize,
        scope: this.scope,
        page:this.page,
        sortDirection:value
      }
    };
    this.router.navigate(['/search'], navigationExtras);
  }
}
