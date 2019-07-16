import { Component, OnInit } from '@angular/core';
import { PaginatedList } from '../../../../../../core/data/paginated-list';
import { SearchResult } from '../../../../../search/search-result.model';
import { RemoteData } from '../../../../../../core/data/remote-data';
import { Observable, ReplaySubject } from 'rxjs';
import { SearchService } from '../../../../../../core/shared/search/search.service';
import { PaginatedSearchOptions } from '../../../../../search/paginated-search-options.model';
import { DSpaceObject } from '../../../../../../core/shared/dspace-object.model';
import { PaginationComponentOptions } from '../../../../../pagination/pagination-component-options.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { hasNoValue, hasValue, isNotEmpty } from '../../../../../empty.util';
import { getSucceededRemoteData } from '../../../../../../core/shared/operators';
import { concat, map, multicast, take, takeWhile, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SEARCH_CONFIG_SERVICE } from '../../../../../../+my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../../../core/shared/search/search-configuration.service';
import { SelectableListService } from '../../../../../object-list/selectable-list/selectable-list.service';
import { ListableObject } from '../../../../../object-collection/shared/listable-object.model';
import { SelectableListState } from '../../../../../object-list/selectable-list/selectable-list.reducer';

const RELATION_TYPE_FILTER_PREFIX = 'f.entityType=';


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
export class DsDynamicLookupRelationModalComponent implements OnInit {
  relationKey: string;
  fieldName: string;
  listId: string;
  resultsRD$: Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>>;
  searchConfig: PaginatedSearchOptions;
  repeatable: boolean;
  searchQuery;
  initialPagination = Object.assign(new PaginationComponentOptions(), {
    id: 'submission-relation-list',
    pageSize: 10
  });
  selection: Observable<ListableObject[]>;

  constructor(public modal: NgbActiveModal, private searchService: SearchService, private router: Router, private selectableListService: SelectableListService) {
  }

  ngOnInit(): void {
    this.resetRoute();
    this.onPaginationChange(this.initialPagination);
    this.selection = this.selectableListService.getSelectableList(this.listId).pipe(map((listState: SelectableListState) => hasValue(listState) && hasValue(listState.selection) ? listState.selection : []));
  }

  search(query: string) {
    this.searchQuery = query;
    this.resetRoute();
    this.onPaginationChange(this.initialPagination);
    this.selectableListService.deselectAll(this.listId);
  }

  onPaginationChange(pagination: PaginationComponentOptions) {
    this.searchConfig = new PaginatedSearchOptions({
      query: this.searchQuery,
      pagination: pagination,
      fixedFilter: RELATION_TYPE_FILTER_PREFIX + this.fieldName
    });
    this.resultsRD$ = this.searchService.search(this.searchConfig).pipe(
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
  }

  close() {
    this.modal.close();
  }

  resetRoute() {
    this.router.navigate([], {
      queryParams: Object.assign({}, { page: 1, query: this.searchQuery }),
    });
  }
}