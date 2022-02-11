import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { SearchResult } from '../../shared/search/models/search-result.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { getFirstSucceededRemoteData } from '../../core/shared/operators';
import { SearchFilter } from '../../shared/search/models/search-filter.model';
import { LuckySearchService } from '../lucky-search.service';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { Context } from '../../core/shared/context.model';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { getItemPageRoute } from '../../item-page/item-page-routing-paths';
import { Item } from '../../core/shared/item.model';

@Component({
  selector: 'ds-lucky-search',
  templateUrl: './lucky-search.component.html',
  styleUrls: ['./lucky-search.component.scss']
})
export class LuckySearchComponent implements OnInit {
  /**
   * The current search results
   */
  resultsRD$: BehaviorSubject<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> = new BehaviorSubject(null);
  /**
   * boolean to show the result in case of no results from search
   */
  showEmptySearchSection = false;
  /**
   * boolean to show the result in case of no results from multiple search
   */
  showMultipleSearchSection = false;
  /**
   * Search options to use for options of the search
   */
  searchOptions$: Observable<PaginatedSearchOptions>;
  /**
   * Current filter taken from url
   */
  currentFilter = {
    identifier: '',
    value: ''
  };
  context: Context = Context.ItemPage;

  constructor(private luckySearchService: LuckySearchService,
              private router: Router,
              public searchConfigService: SearchConfigurationService) {
  }

  ngOnInit(): void {
    this.searchOptions$ = this.getSearchOptions();
    this.readResult();
    const urlTree = this.router.parseUrl(this.router.url);
    // tslint:disable-next-line:forin
    for (const key in urlTree.queryParams) {
      if (key === 'index') {
        this.currentFilter.identifier = urlTree.queryParams[key];
      }
      if (key === 'value') {
        this.currentFilter.value = urlTree.queryParams[key];
      }
    }
    if (!(this.currentFilter.value !== '' && this.currentFilter.identifier !== '')) {
      this.showEmptySearchSection = true;
      return;
    }
    this.searchOptions$.pipe(
      switchMap((options: PaginatedSearchOptions) => {
        options.filters = [new SearchFilter('f.' + this.currentFilter.identifier, [this.currentFilter.value], 'equals')];
        return this.luckySearchService.sendRequest(options).pipe(
          tap((rd: any) => {
            if (rd.state && rd.state === 'Error') {
              this.showEmptySearchSection = true;
            }
          }),
          getFirstSucceededRemoteData());
      }))
      .subscribe((results) => {
        return this.resultsRD$.next(results as any);
      });


  }

  private readResult() {
    this.resultsRD$.subscribe((res: RemoteData<PaginatedList<SearchResult<DSpaceObject>>>) => {
      if (!res) {
        return;
      }
      const total = res.payload.totalElements;
      if (total === 0) {
        // show message
        this.showEmptySearchSection = true;
      } else {
        if (total === 1) {
          const url = getItemPageRoute(res.payload.page[0].indexableObject as Item) ;
          // redirect to items detail page
          this.redirectToItemsDetailPage(url);
        } else {
          // show message and all list of results
          this.showMultipleSearchSection = true;
        }
      }
    });
  }

  private getSearchOptions(): Observable<PaginatedSearchOptions> {
    return this.searchConfigService.paginatedSearchOptions;
  }

  public redirectToItemsDetailPage(url): void {
    this.router.navigateByUrl(url, {replaceUrl: true});
  }

}
