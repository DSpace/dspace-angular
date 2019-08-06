import { Component, OnDestroy, OnInit } from '@angular/core';
import { PaginatedList } from '../../../../../core/data/paginated-list';
import { SearchResult } from '../../../../search/search-result.model';
import { RemoteData } from '../../../../../core/data/remote-data';
import { Observable, ReplaySubject } from 'rxjs';
import { SearchService } from '../../../../../core/shared/search/search.service';
import { PaginatedSearchOptions } from '../../../../search/paginated-search-options.model';
import { DSpaceObject } from '../../../../../core/shared/dspace-object.model';
import { PaginationComponentOptions } from '../../../../pagination/pagination-component-options.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { hasValue, isNotEmpty } from '../../../../empty.util';
import { concat, map, multicast, switchMap, take, takeWhile, tap } from 'rxjs/operators';
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
import { combineLatest as observableCombineLatest } from 'rxjs';

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
  itemRD$: Observable<RemoteData<Item>>;
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
    pageSize: 10
  });
  selection$: Observable<ListableObject[]>;

  constructor(
    public modal: NgbActiveModal,
    private searchService: SearchService,
    private router: Router,
    private selectableListService: SelectableListService,
    private searchConfigService: SearchConfigurationService,
    private routeService: RouteService,
    private relationshipService: RelationshipService,
    private relationshipTypeService: RelationshipTypeService
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
    )

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
      queryParams: Object.assign({}, { page: 1, query: this.searchQuery }),
    });
  }

  selectPage(page: SearchResult<DSpaceObject>[]) {
    this.selectableListService.select(this.listId, page);
  }

  deselectPage(page: SearchResult<DSpaceObject>[]) {
    this.allSelected = false;
    this.selectableListService.deselect(this.listId, page);
  }

  selectAll() {
    this.allSelected = true;
    this.selectAllLoading = true;
    const fullPagination = Object.assign(new PaginationComponentOptions(), {
      query: this.searchQuery,
      currentPage: 1,
      pageSize: Number.POSITIVE_INFINITY
    });
    const fullSearchConfig = Object.assign(this.searchConfig, { pagination: fullPagination });
    const results = this.searchService.search(fullSearchConfig);
    results.pipe(
      getSucceededRemoteData(),
      map((resultsRD) => resultsRD.payload.page),
      tap(() => this.selectAllLoading = false),
    ).subscribe((results) => this.selectableListService.select(this.listId, results));
  }

  deselectAll() {
    this.allSelected = false;
    this.selectableListService.deselectAll(this.listId);
  }


  select(selectableObject: SearchResult<Item>) {
    const relationshipType$: Observable<RelationshipType> = this.itemRD$.pipe(
      getSucceededRemoteData(),
      switchMap((itemRD: RemoteData<Item>) => {
        const type1: string = itemRD.payload.firstMetadataValue('relationship.type');
        const type2: string = selectableObject.indexableObject.firstMetadataValue('relationship.type');
        return this.relationshipTypeService.getRelationshipTypeByLabelAndTypes(this.relationship.relationshipType, type1, type2);
      }));

    this.subscription = observableCombineLatest(relationshipType$, this.itemRD$)
      .pipe(
        take(1),
        switchMap(([type, itemRD]: [RelationshipType, RemoteData<Item>]) => {
          const isSwitched = type.rightLabel === this.relationship.relationshipType;
          let result;
          if (isSwitched) {
            result = this.relationshipService.addRelationship(type.id, selectableObject.indexableObject, itemRD.payload);
          } else {
            result = this.relationshipService.addRelationship(type.id, itemRD.payload, selectableObject.indexableObject);
          }
          console.log(result);
          return result;
        })
      )
      .subscribe();
  }


  deselect(selectableObject: SearchResult<Item>) {
    const relationshipType$: Observable<RelationshipType> = this.itemRD$.pipe(
      getSucceededRemoteData(),
      switchMap((itemRD: RemoteData<Item>) => {
        const type1: string = itemRD.payload.firstMetadataValue('relationship.type');
        const type2: string = selectableObject.indexableObject.firstMetadataValue('relationship.type');
        return this.relationshipTypeService.getRelationshipTypeByLabelAndTypes(this.relationship.relationshipType, type1, type2);
      }));

    this.subscription = observableCombineLatest(relationshipType$, this.itemRD$)
      .pipe(
        take(1),
        switchMap(([type, itemRD]: [RelationshipType, RemoteData<Item>]) => {
          const isSwitched = type.rightLabel === this.relationship.relationshipType;
          if (isSwitched) {
            return this.relationshipService.addRelationship(type.id, selectableObject.indexableObject, itemRD.payload);
          } else {
            return this.relationshipService.addRelationship(type.id, itemRD.payload, selectableObject.indexableObject);
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    if (hasValue(this.subscription)) {
      this.subscription.unsubscribe();
    }
  }
}