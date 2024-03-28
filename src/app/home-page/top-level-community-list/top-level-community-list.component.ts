import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest as observableCombineLatest,
  Subscription,
} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  APP_CONFIG,
  AppConfig,
} from 'src/config/app-config.interface';

import {
  SortDirection,
  SortOptions,
} from '../../core/cache/models/sort-options.model';
import { CommunityDataService } from '../../core/data/community-data.service';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { PaginationService } from '../../core/pagination/pagination.service';
import { Community } from '../../core/shared/community.model';
import { fadeInOut } from '../../shared/animations/fade';
import { hasValue } from '../../shared/empty.util';
import { ErrorComponent } from '../../shared/error/error.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { ObjectCollectionComponent } from '../../shared/object-collection/object-collection.component';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { VarDirective } from '../../shared/utils/var.directive';

/**
 * this component renders the Top-Level Community list
 */
@Component({
  selector: 'ds-base-top-level-community-list',
  styleUrls: ['./top-level-community-list.component.scss'],
  templateUrl: './top-level-community-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut],
  standalone: true,
  imports: [VarDirective, NgIf, ObjectCollectionComponent, ErrorComponent, ThemedLoadingComponent, AsyncPipe, TranslateModule],
})

export class TopLevelCommunityListComponent implements OnInit, OnDestroy {
  /**
   * A list of remote data objects of all top communities
   */
  communitiesRD$: BehaviorSubject<RemoteData<PaginatedList<Community>>> = new BehaviorSubject<RemoteData<PaginatedList<Community>>>({} as any);

  /**
   * The pagination configuration
   */
  config: PaginationComponentOptions;

  /**
   * The pagination id
   */
  pageId = 'tl';

  /**
   * The sorting configuration
   */
  sortConfig: SortOptions;

  /**
   * The subscription to the observable for the current page.
   */
  currentPageSubscription: Subscription;

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    private cds: CommunityDataService,
    private paginationService: PaginationService,
  ) {
    this.config = new PaginationComponentOptions();
    this.config.id = this.pageId;
    this.config.pageSize = appConfig.homePage.topLevelCommunityList.pageSize;
    this.config.currentPage = 1;
    this.sortConfig = new SortOptions('dc.title', SortDirection.ASC);
  }

  ngOnInit() {
    this.initPage();
  }


  /**
   * Update the list of top communities
   */
  initPage() {
    const pagination$ = this.paginationService.getCurrentPagination(this.config.id, this.config);
    const sort$ = this.paginationService.getCurrentSort(this.config.id, this.sortConfig);

    this.currentPageSubscription = observableCombineLatest([pagination$, sort$]).pipe(
      switchMap(([currentPagination, currentSort]) => {
        return this.cds.findTop({
          currentPage: currentPagination.currentPage,
          elementsPerPage: currentPagination.pageSize,
          sort: { field: currentSort.field, direction: currentSort.direction },
        });
      }),
    ).subscribe((results) => {
      this.communitiesRD$.next(results);
    });
  }

  /**
   * Unsubscribe the top list subscription if it exists
   */
  private unsubscribe() {
    if (hasValue(this.currentPageSubscription)) {
      this.currentPageSubscription.unsubscribe();
    }
  }

  /**
   * Clean up subscriptions when the component is destroyed
   */
  ngOnDestroy() {
    this.unsubscribe();
    this.paginationService.clearPagination(this.config.id);
  }

}
