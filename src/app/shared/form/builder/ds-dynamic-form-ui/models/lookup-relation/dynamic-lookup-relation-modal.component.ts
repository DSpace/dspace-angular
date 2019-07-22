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
import { hasValue } from '../../../../../empty.util';
import { concat, map, multicast, switchMap, take, takeWhile } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SEARCH_CONFIG_SERVICE } from '../../../../../../+my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../../../core/shared/search/search-configuration.service';
import { SelectableListService } from '../../../../../object-list/selectable-list/selectable-list.service';
import { SelectableListState } from '../../../../../object-list/selectable-list/selectable-list.reducer';
import { ListableObject } from '../../../../../object-collection/shared/listable-object.model';

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
  fixedFilter: string;
  constructor(public modal: NgbActiveModal, private searchService: SearchService, private router: Router, private selectableListService: SelectableListService, private searchConfigService: SearchConfigurationService) {
  }

  ngOnInit(): void {
    this.resetRoute();
    this.fixedFilter = RELATION_TYPE_FILTER_PREFIX + this.fieldName;
    this.selection = this.selectableListService.getSelectableList(this.listId).pipe(map((listState: SelectableListState) => hasValue(listState) && hasValue(listState.selection) ? listState.selection : []));
    this.resultsRD$ = this.searchConfigService.paginatedSearchOptions.pipe(
      map((options) => {
        return Object.assign(new PaginatedSearchOptions({}), options, { fixedFilter: RELATION_TYPE_FILTER_PREFIX + this.fieldName })
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
    this.searchQuery = query;
    this.resetRoute();
    this.selectableListService.deselectAll(this.listId);
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