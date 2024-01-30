import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, combineLatest as observableCombineLatest, Subscription } from 'rxjs';

import { RemoteData } from '../../core/data/remote-data';
import { Collection } from '../../core/shared/collection.model';
import { Community } from '../../core/shared/community.model';
import { fadeIn } from '../../shared/animations/fade';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { PaginationService } from '../../core/pagination/pagination.service';
import { switchMap } from 'rxjs/operators';
import { hasValue } from '../../shared/empty.util';

@Component({
  selector: 'ds-community-page-sub-collection-list',
  styleUrls: ['./community-page-sub-collection-list.component.scss'],
  templateUrl: './community-page-sub-collection-list.component.html',
  animations:[fadeIn]
})
export class CommunityPageSubCollectionListComponent implements OnInit, OnDestroy {
  @Input() community: Community;

  /**
   * Optional page size. Overrides communityList.pageSize configuration for this component.
   * Value can be added in the themed version of the parent component.
   */
  @Input() pageSize: number;

  /**
   * The pagination configuration
   */
  config: PaginationComponentOptions;

  /**
   * The pagination id
   */
  pageId = 'cmcl';

  /**
   * The sorting configuration
   */
  sortConfig: SortOptions;

  /**
   * A list of remote data objects of communities' collections
   */
  subCollectionsRDObs: BehaviorSubject<RemoteData<PaginatedList<Collection>>> = new BehaviorSubject<RemoteData<PaginatedList<Collection>>>({} as any);

  subscriptions: Subscription[] = [];

  constructor(
    protected cds: CollectionDataService,
    protected paginationService: PaginationService,
    protected route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.config = new PaginationComponentOptions();
    this.config.id = this.pageId;
    if (hasValue(this.pageSize)) {
      this.config.pageSize = this.pageSize;
    } else {
      this.config.pageSize = this.route.snapshot.queryParams[this.pageId + '.rpp'] ?? this.config.pageSize;
    }
    this.config.currentPage = this.route.snapshot.queryParams[this.pageId + '.page'] ?? 1;
    this.sortConfig = new SortOptions('dc.title', SortDirection[this.route.snapshot.queryParams[this.pageId + '.sd']] ?? SortDirection.ASC);
    this.initPage();
  }

  /**
   * Initialise the list of collections
   */
  initPage() {
     const pagination$ = this.paginationService.getCurrentPagination(this.config.id, this.config);
     const sort$ = this.paginationService.getCurrentSort(this.config.id, this.sortConfig);

    this.subscriptions.push(observableCombineLatest([pagination$, sort$]).pipe(
      switchMap(([currentPagination, currentSort]) => {
        return this.cds.findByParent(this.community.id, {
          currentPage: currentPagination.currentPage,
          elementsPerPage: currentPagination.pageSize,
          sort: {field: currentSort.field, direction: currentSort.direction}
        });
      })
    ).subscribe((results) => {
      this.subCollectionsRDObs.next(results);
    }));
  }

  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.config?.id);
    this.subscriptions.map((subscription: Subscription) => subscription.unsubscribe());
  }

}
