import { Component, OnInit } from '@angular/core';
import { PaginatedList } from '../../../../../../core/data/paginated-list';
import { SearchResult } from '../../../../../../+search-page/search-result.model';
import { RemoteData } from '../../../../../../core/data/remote-data';
import { Observable, ReplaySubject } from 'rxjs';
import { SearchService } from '../../../../../../+search-page/search-service/search.service';
import { PaginatedSearchOptions } from '../../../../../../+search-page/paginated-search-options.model';
import { DSpaceObject } from '../../../../../../core/shared/dspace-object.model';
import { PaginationComponentOptions } from '../../../../../pagination/pagination-component-options.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { hasNoValue, hasValue, isNotEmpty } from '../../../../../empty.util';
import { getSucceededRemoteData } from '../../../../../../core/shared/operators';
import { concat, map, multicast, take, takeWhile } from 'rxjs/operators';

const RELATION_TYPE_FILTER_PREFIX = 'f.entityType=';

/* TODO take a look at this when the REST entities submission is finished: we will probably need to get the fixed filter from the REST instead of filtering is out from the metadata field */
const RELATION_TYPE_METADATA_PREFIX = 'relation.isPublicationOf';

@Component({
  selector: 'ds-dynamic-lookup-relation-modal',
  styleUrls: ['./dynamic-lookup-relation-modal.component.scss'],
  templateUrl: './dynamic-lookup-relation-modal.component.html'
})
export class DsDynamicLookupRelationModalComponent implements OnInit {
  relationKey: string;
  fieldName: string;
  resultsRD$: Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>>;
  searchConfig: PaginatedSearchOptions;
  repeatable: boolean;
  selection: DSpaceObject[] = [];
  allSelected = false;
  queryInput;
  searchQuery;
  initialPagination = Object.assign(new PaginationComponentOptions(), {
    id: 'submission-relation-list',
    pageSize: 5
  });
  constructor(public modal: NgbActiveModal, private searchService: SearchService) {
  }

  ngOnInit(): void {
    this.fieldName = this.relationKey.substring(RELATION_TYPE_METADATA_PREFIX.length);
    this.onPaginationChange(this.initialPagination);
  }

  search() {
    this.searchQuery = this.queryInput;
    this.onPaginationChange(this.initialPagination);
    this.deselectAll();
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
    this.modal.close(this.selection);
  }

  isSelected(dso: DSpaceObject): boolean {
    return hasValue(this.selection.find((selected) => selected.uuid === dso.uuid));
  }

  selectCheckbox(value: boolean, dso: DSpaceObject) {
    if (value) {
      this.selection = [...this.selection, dso];
    } else {
      this.allSelected = false;
      this.selection = this.selection.filter((selected) => {
        return selected.uuid !== dso.uuid
      });
    }
  }

  selectRadio(value: boolean, dso: DSpaceObject) {
    if (value) {
      this.selection = [dso];
    }
  }

  selectPage(page: SearchResult<DSpaceObject>[]) {
    const newObjects: DSpaceObject[] = page
      .map((searchResult) => searchResult.indexableObject)
      .filter((dso) => hasNoValue(this.selection.find((selected) => selected.uuid === dso.uuid)));
    this.selection = [...this.selection, ...newObjects]
  }

  deselectPage(page: SearchResult<DSpaceObject>[]) {
    this.allSelected = false;
    const objects: DSpaceObject[] = page
      .map((searchResult) => searchResult.indexableObject);
    this.selection = this.selection.filter((selected) => hasNoValue(objects.find((object) => object.uuid === selected.uuid)));
  }

  selectAll() {
    this.allSelected = true;
    const fullPagination = Object.assign(new PaginationComponentOptions(), {
      query: this.searchQuery,
      currentPage: 1,
      pageSize: Number.POSITIVE_INFINITY
    });
    const fullSearchConfig = Object.assign(this.searchConfig, { pagination: fullPagination });
    const results = this.searchService.search(fullSearchConfig);
    results.pipe(
        getSucceededRemoteData(),
        map((resultsRD) => resultsRD.payload.page)
      )
      .subscribe((results) =>
        this.selection = [...this.selection, ...results.map((searchResult) => searchResult.indexableObject)]
      );
  }

  deselectAll() {
    this.allSelected = false;
    this.selection = [];
  }


  isAllSelected() {
    return this.allSelected;
  }

  isSomeSelected() {
    return isNotEmpty(this.selection);
  }
}