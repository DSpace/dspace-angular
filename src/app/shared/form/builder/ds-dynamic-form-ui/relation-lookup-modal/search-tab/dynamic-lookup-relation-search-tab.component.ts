import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SEARCH_CONFIG_SERVICE } from '../../../../../../+my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../../../core/shared/search/search-configuration.service';
import { Item } from '../../../../../../core/shared/item.model';
import { PaginatedSearchOptions } from '../../../../../search/paginated-search-options.model';
import { SearchResult } from '../../../../../search/search-result.model';
import { PaginatedList } from '../../../../../../core/data/paginated-list';
import { RemoteData } from '../../../../../../core/data/remote-data';
import { Observable, ReplaySubject } from 'rxjs';
import { RelationshipOptions } from '../../../models/relationship-options.model';
import { PaginationComponentOptions } from '../../../../../pagination/pagination-component-options.model';
import { ListableObject } from '../../../../../object-collection/shared/listable-object.model';
import { SearchService } from '../../../../../../core/shared/search/search.service';
import { Router } from '@angular/router';
import { SelectableListService } from '../../../../../object-list/selectable-list/selectable-list.service';
import { RouteService } from '../../../../../services/route.service';
import { SelectableListState } from '../../../../../object-list/selectable-list/selectable-list.reducer';
import { hasValue, isNotEmpty } from '../../../../../empty.util';
import { concat, map, multicast, switchMap, take, takeWhile, tap } from 'rxjs/operators';
import { DSpaceObject } from '../../../../../../core/shared/dspace-object.model';
import { getSucceededRemoteData } from '../../../../../../core/shared/operators';

@Component({
  selector: 'ds-dynamic-lookup-relation-search-tab',
  styleUrls: ['./dynamic-lookup-relation-search-tab.component.scss'],
  templateUrl: './dynamic-lookup-relation-search-tab.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})

export class DsDynamicLookupRelationSearchTabComponent implements OnInit, OnDestroy {
  @Input() relationship: RelationshipOptions;
  @Input() listId: string;
  @Input() repeatable: boolean;
  @Input() selection$: Observable<ListableObject[]>;
  @Output() deselectObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();
  @Output() selectObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();
  resultsRD$: Observable<RemoteData<PaginatedList<SearchResult<Item>>>>;
  searchConfig: PaginatedSearchOptions;
  searchQuery;
  allSelected: boolean;
  someSelected$: Observable<boolean>;
  selectAllLoading: boolean;
  subscription;
  initialPagination = Object.assign(new PaginationComponentOptions(), {
    id: 'submission-relation-list',
    pageSize: 5
  });

  constructor(
    private searchService: SearchService,
    private router: Router,
    private selectableListService: SelectableListService,
    private searchConfigService: SearchConfigurationService,
    private routeService: RouteService,
  ) {
  }

  ngOnInit(): void {
    this.resetRoute();
    this.routeService.setParameter('fixedFilterQuery', this.relationship.filter);
    this.routeService.setParameter('configuration', this.relationship.searchConfiguration);

    this.someSelected$ = this.selection$.pipe(map((selection) => isNotEmpty(selection)));
    this.resultsRD$ = this.searchConfigService.paginatedSearchOptions.pipe(
      map((options) => {
        return Object.assign(new PaginatedSearchOptions({}), options, { fixedFilter: this.relationship.filter, configuration: this.relationship.searchConfiguration })
      }),
      switchMap((options) => {
        this.searchQuery = options.query;
        this.searchConfig = options;
        return this.searchService.search(options).pipe(
          /* Make sure to only listen to the first x results, until loading is finished */
          /* TODO: in Rxjs 6.4.0 and up, we can replace this with takeWhile(predicate, true) - see https://stackoverflow.com/a/44644237 */
          multicast(
            () => new ReplaySubject(1),
            subject => subject.pipe(
              takeWhile((rd: RemoteData<PaginatedList<SearchResult<DSpaceObject>>>) => rd.isLoading),
              concat(subject.pipe(take(1))
              )
            )
          ) as any
        )
      })
    );
    this.resultsRD$.subscribe((t) => console.log(t));

  }

  search(query: string) {
    this.allSelected = false;
    this.searchQuery = query;
    this.resetRoute();
  }

  resetRoute() {
    this.router.navigate([], {
      queryParams: Object.assign({}, { page: 1, query: this.searchQuery, pageSize: this.initialPagination.pageSize }),
    });
  }

  selectPage(page: SearchResult<Item>[]) {
    this.selection$
      .pipe(take(1))
      .subscribe((selection: SearchResult<Item>[]) => {
        const filteredPage = page.filter((pageItem) => selection.findIndex((selected) => selected.equals(pageItem)) < 0)
        this.selectObject.emit(...filteredPage);
      });
    this.selectableListService.select(this.listId, page);
  }

  deselectPage(page: SearchResult<Item>[]) {
    this.allSelected = false;
    this.selection$
      .pipe(take(1))
      .subscribe((selection: SearchResult<Item>[]) => {
        const filteredPage = page.filter((pageItem) => selection.findIndex((selected) => selected.equals(pageItem)) >= 0)
        this.deselectObject.emit(...filteredPage);
      });
    this.selectableListService.deselect(this.listId, page);
  }

  selectAll() {
    this.allSelected = true;
    this.selectAllLoading = true;
    const fullPagination = Object.assign(new PaginationComponentOptions(), {
      query: this.searchQuery,
      currentPage: 1,
      pageSize: 9999
    });
    const fullSearchConfig = Object.assign(this.searchConfig, { pagination: fullPagination });
    const results$ = this.searchService.search(fullSearchConfig) as Observable<RemoteData<PaginatedList<SearchResult<Item>>>>;
    results$.pipe(
      getSucceededRemoteData(),
      map((resultsRD) => resultsRD.payload.page),
      tap(() => this.selectAllLoading = false),
    ).subscribe((results) => {
        this.selection$
          .pipe(take(1))
          .subscribe((selection: SearchResult<Item>[]) => {
            const filteredResults = results.filter((pageItem) => selection.findIndex((selected) => selected.equals(pageItem)) < 0);
            this.selectObject.emit(...filteredResults);
          });
        this.selectableListService.select(this.listId, results);
      }
    );
  }

  deselectAll() {
    this.allSelected = false;
    this.selection$
      .pipe(take(1))
      .subscribe((selection: SearchResult<Item>[]) => this.deselectObject.emit(...selection));
    this.selectableListService.deselectAll(this.listId);
  }

  ngOnDestroy(): void {
    if (hasValue(this.subscription)
    ) {
      this.subscription.unsubscribe();
    }
  }
}