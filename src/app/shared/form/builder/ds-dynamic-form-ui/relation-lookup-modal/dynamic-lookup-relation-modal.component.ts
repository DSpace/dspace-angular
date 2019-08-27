import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { PaginatedList } from '../../../../../core/data/paginated-list';
import { SearchResult } from '../../../../search/search-result.model';
import { RemoteData } from '../../../../../core/data/remote-data';
import { from, Observable, ReplaySubject } from 'rxjs';
import { SearchService } from '../../../../../core/shared/search/search.service';
import { PaginatedSearchOptions } from '../../../../search/paginated-search-options.model';
import { DSpaceObject } from '../../../../../core/shared/dspace-object.model';
import { PaginationComponentOptions } from '../../../../pagination/pagination-component-options.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { hasValue, hasValueOperator, isNotEmpty } from '../../../../empty.util';
import { concat, map, mergeMap, multicast, switchMap, take, takeWhile, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SEARCH_CONFIG_SERVICE } from '../../../../../+my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../../core/shared/search/search-configuration.service';
import { SelectableListService } from '../../../../object-list/selectable-list/selectable-list.service';
import { SelectableListState } from '../../../../object-list/selectable-list/selectable-list.reducer';
import { ListableObject } from '../../../../object-collection/shared/listable-object.model';
import { RouteService } from '../../../../services/route.service';
import { getSucceededRemoteData } from '../../../../../core/shared/operators';
import { RelationshipTypeService } from '../../../../../core/data/relationship-type.service';
import { RelationshipType } from '../../../../../core/shared/item-relationships/relationship-type.model';
import { RelationshipService } from '../../../../../core/data/relationship.service';
import { Item } from '../../../../../core/shared/item.model';
import { RelationshipOptions } from '../../models/relationship-options.model';
import { Relationship } from '../../../../../core/shared/item-relationships/relationship.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../app.reducer';
import { AddRelationshipAction, RemoveRelationshipAction } from './relationship.actions';

@Component({
  selector: 'ds-dynamic-lookup-relation-modal',
  styleUrls: ['./dynamic-lookup-relation-modal.component.scss'],
  templateUrl: './dynamic-lookup-relation-modal.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})

export class DsDynamicLookupRelationModalComponent implements OnInit, OnDestroy {
  label: string;
  relationship: RelationshipOptions;
  listId: string;
  resultsRD$: Observable<RemoteData<PaginatedList<SearchResult<Item>>>>;
  searchConfig: PaginatedSearchOptions;
  repeatable: boolean;
  searchQuery;
  allSelected: boolean;
  someSelected$: Observable<boolean>;
  selectAllLoading: boolean;
  subscription;
  initialPagination = Object.assign(new PaginationComponentOptions(), {
    id: 'submission-relation-list',
    pageSize: 5
  });
  selection$: Observable<ListableObject[]>;
  itemRD$;

  constructor(
    public modal: NgbActiveModal,
    private searchService: SearchService,
    private router: Router,
    private selectableListService: SelectableListService,
    private searchConfigService: SearchConfigurationService,
    private routeService: RouteService,
    private relationshipService: RelationshipService,
    private relationshipTypeService: RelationshipTypeService,
    private zone: NgZone,
    private store: Store<AppState>
  ) {
  }

  ngOnInit(): void {
    this.resetRoute();
    this.routeService.setParameter('fixedFilterQuery', this.relationship.filter);
    this.routeService.setParameter('configuration', this.relationship.searchConfiguration);

    this.selection$ = this.selectableListService.getSelectableList(this.listId).pipe(map((listState: SelectableListState) => hasValue(listState) && hasValue(listState.selection) ? listState.selection : []));
    this.someSelected$ = this.selection$.pipe(map((selection) => isNotEmpty(selection)));
    this.resultsRD$ = this.searchConfigService.paginatedSearchOptions.pipe(
      map((options) => {
        return Object.assign(new PaginatedSearchOptions({}), options, { fixedFilter: this.relationship.filter, configuration: this.relationship.searchConfiguration })
      }),
      switchMap((options) => {
        this.searchConfig = options;
        return this.searchService.search(options).pipe(
          /* Make sure to only listen to the first x results, until loading is finished */
          /* TODO: in Rxjs 6.4.0 and up, we can replace this by takeWhile(predicate, true) - see https://stackoverflow.com/a/44644237 */
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

  }

  search(query: string) {
    this.allSelected = false;
    this.searchQuery = query;
    this.resetRoute();
  }

  close() {
    this.modal.close();
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
        this.select(...filteredPage);
      });
    this.selectableListService.select(this.listId, page);
  }

  deselectPage(page: SearchResult<Item>[]) {
    this.allSelected = false;
    this.selection$
      .pipe(take(1))
      .subscribe((selection: SearchResult<Item>[]) => {
        const filteredPage = page.filter((pageItem) => selection.findIndex((selected) => selected.equals(pageItem)) >= 0)
        this.deselect(...filteredPage);
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
            this.select(...filteredResults);
          });
        this.selectableListService.select(this.listId, results);
      }
    );
  }

  deselectAll() {
    this.allSelected = false;
    this.selection$
      .pipe(take(1))
      .subscribe((selection: SearchResult<Item>[]) => this.deselect(...selection));
    this.selectableListService.deselectAll(this.listId);
  }


  select(...selectableObjects: SearchResult<Item>[]) {
    this.zone.runOutsideAngular(
      () => this.itemRD$
        .pipe(
          getSucceededRemoteData(),
          tap((itemRD: RemoteData<Item>) => {
            return selectableObjects.forEach((object) =>
              this.store.dispatch(new AddRelationshipAction(itemRD.payload, object.indexableObject, this.relationship.relationshipType))
            );
          })
        ).subscribe());
  }


  deselect(...selectableObjects: SearchResult<Item>[]) {
    this.zone.runOutsideAngular(
      () => this.itemRD$.pipe(
        getSucceededRemoteData(),
        tap((itemRD: RemoteData<Item>) => {
          return selectableObjects.forEach((object) =>
            this.store.dispatch(new RemoveRelationshipAction(itemRD.payload, object.indexableObject, this.relationship.relationshipType))
          );
        })
      ).subscribe()
    );
  }

  ngOnDestroy(): void {
    if (hasValue(this.subscription)
    ) {
      this.subscription.unsubscribe();
    }
  }
}