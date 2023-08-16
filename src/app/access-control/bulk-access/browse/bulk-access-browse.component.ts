import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { SelectableListService } from '../../../shared/object-list/selectable-list/selectable-list.service';
import { SelectableListState } from '../../../shared/object-list/selectable-list/selectable-list.reducer';
import { RemoteData } from '../../../core/data/remote-data';
import { buildPaginatedList, PaginatedList } from '../../../core/data/paginated-list.model';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { createSuccessfulRemoteDataObject } from '../../../shared/remote-data.utils';
import { PageInfo } from '../../../core/shared/page-info.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { hasValue } from '../../../shared/empty.util';

@Component({
  selector: 'ds-bulk-access-browse',
  templateUrl: 'bulk-access-browse.component.html',
  styleUrls: ['./bulk-access-browse.component.scss'],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})
export class BulkAccessBrowseComponent implements OnInit, OnDestroy {

  /**
   * The selection list id
   */
  @Input() listId!: string;

  /**
   * The active nav id
   */
  activateId = 'search';

  /**
   * The list of the objects already selected
   */
  objectsSelected$: BehaviorSubject<RemoteData<PaginatedList<ListableObject>>> = new BehaviorSubject<RemoteData<PaginatedList<ListableObject>>>(null);

  /**
   * The pagination options object used for the list of selected elements
   */
  paginationOptions$: BehaviorSubject<PaginationComponentOptions> = new BehaviorSubject<PaginationComponentOptions>(Object.assign(new PaginationComponentOptions(), {
    id: 'bas',
    pageSize: 5,
    currentPage: 1
  }));

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   */
  private subs: Subscription[] = [];

  constructor(private selectableListService: SelectableListService) {}

  /**
   * Subscribe to selectable list updates
   */
  ngOnInit(): void {

    this.subs.push(
      this.selectableListService.getSelectableList(this.listId).pipe(
        distinctUntilChanged(),
        map((list: SelectableListState) => this.generatePaginatedListBySelectedElements(list))
      ).subscribe(this.objectsSelected$)
    );
  }

  pageNext() {
    this.paginationOptions$.next(Object.assign(new PaginationComponentOptions(), this.paginationOptions$.value, {
      currentPage: this.paginationOptions$.value.currentPage + 1
    }));
  }

  pagePrev() {
    this.paginationOptions$.next(Object.assign(new PaginationComponentOptions(), this.paginationOptions$.value, {
      currentPage: this.paginationOptions$.value.currentPage - 1
    }));
  }

  private calculatePageCount(pageSize, totalCount = 0) {
    // we suppose that if we have 0 items we want 1 empty page
    return totalCount < pageSize ? 1 : Math.ceil(totalCount / pageSize);
  }

  /**
   * Generate The RemoteData object containing the list of the selected elements
   * @param list
   * @private
   */
  private generatePaginatedListBySelectedElements(list: SelectableListState): RemoteData<PaginatedList<ListableObject>> {
    const pageInfo = new PageInfo({
      elementsPerPage: this.paginationOptions$.value.pageSize,
      totalElements: list?.selection.length,
      totalPages: this.calculatePageCount(this.paginationOptions$.value.pageSize, list?.selection.length),
      currentPage: this.paginationOptions$.value.currentPage
    });
    if (pageInfo.currentPage > pageInfo.totalPages) {
      pageInfo.currentPage = pageInfo.totalPages;
      this.paginationOptions$.next(Object.assign(new PaginationComponentOptions(), this.paginationOptions$.value, {
        currentPage: pageInfo.currentPage
      }));
    }
    return createSuccessfulRemoteDataObject(buildPaginatedList(pageInfo, list?.selection || []));
  }

  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
    this.selectableListService.deselectAll(this.listId);
  }
}
