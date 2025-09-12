import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  SortDirection,
  SortOptions,
} from '@dspace/core/cache/models/sort-options.model';
import { CommunityDataService } from '@dspace/core/data/community-data.service';
import { PaginatedList } from '@dspace/core/data/paginated-list.model';
import { RemoteData } from '@dspace/core/data/remote-data';
import { PaginationService } from '@dspace/core/pagination/pagination.service';
import { PaginationComponentOptions } from '@dspace/core/pagination/pagination-component-options.model';
import { Community } from '@dspace/core/shared/community.model';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest as observableCombineLatest,
  Subscription,
} from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { fadeIn } from '../../../../shared/animations/fade';
import { ErrorComponent } from '../../../../shared/error/error.component';
import { ThemedLoadingComponent } from '../../../../shared/loading/themed-loading.component';
import { ObjectCollectionComponent } from '../../../../shared/object-collection/object-collection.component';
import { VarDirective } from '../../../../shared/utils/var.directive';

@Component({
  selector: 'ds-base-community-page-sub-community-list',
  styleUrls: ['./community-page-sub-community-list.component.scss'],
  templateUrl: './community-page-sub-community-list.component.html',
  animations: [fadeIn],
  imports: [
    AsyncPipe,
    ErrorComponent,
    ObjectCollectionComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
  standalone: true,
})
/**
 * Component to render the sub-communities of a Community
 */
export class CommunityPageSubCommunityListComponent implements OnInit, OnDestroy {
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
  pageId = 'cmscm';

  /**
   * The sorting configuration
   */
  sortConfig: SortOptions;

  /**
   * A list of remote data objects of communities' collections
   */
  subCommunitiesRDObs: BehaviorSubject<RemoteData<PaginatedList<Community>>> = new BehaviorSubject<RemoteData<PaginatedList<Community>>>({} as any);

  subscriptions: Subscription[] = [];

  constructor(
    protected cds: CommunityDataService,
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
   * Update the list of sub-communities
   */
  initPage() {
    const pagination$ = this.paginationService.getCurrentPagination(this.config.id, this.config);
    const sort$ = this.paginationService.getCurrentSort(this.config.id, this.sortConfig);

    this.subscriptions.push(observableCombineLatest([pagination$, sort$]).pipe(
      switchMap(([currentPagination, currentSort]) => {
        return     this.cds.findByParent(this.community.id, {
          currentPage: currentPagination.currentPage,
          elementsPerPage: currentPagination.pageSize,
          sort: { field: currentSort.field, direction: currentSort.direction },
        });
      }),
    ).subscribe((results) => {
      this.subCommunitiesRDObs.next(results);
    }));
  }

  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.config?.id);
    this.subscriptions.map((subscription: Subscription) => subscription.unsubscribe());
  }

}
