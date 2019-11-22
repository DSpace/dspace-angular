import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { CommunityDataService } from '../../core/data/community-data.service';
import { PaginatedList } from '../../core/data/paginated-list';

import { RemoteData } from '../../core/data/remote-data';
import { Community } from '../../core/shared/community.model';

import { fadeInOut } from '../../shared/animations/fade';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { take } from 'rxjs/operators';

/**
 * this component renders the Top-Level Community list
 */
@Component({
  selector: 'ds-top-level-community-list',
  styleUrls: ['./top-level-community-list.component.scss'],
  templateUrl: './top-level-community-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut]
})

export class TopLevelCommunityListComponent implements OnInit {
  /**
   * A list of remote data objects of all top communities
   */
  communitiesRD$: BehaviorSubject<RemoteData<PaginatedList<Community>>> = new BehaviorSubject<RemoteData<PaginatedList<Community>>>({} as any);

  /**
   * The pagination configuration
   */
  config: PaginationComponentOptions;

  /**
   * The sorting configuration
   */
  sortConfig: SortOptions;

  constructor(private cds: CommunityDataService) {
    this.config = new PaginationComponentOptions();
    this.config.id = 'top-level-pagination';
    this.config.pageSize = 5;
    this.config.currentPage = 1;
    this.sortConfig = new SortOptions('dc.title', SortDirection.ASC);
  }

  ngOnInit() {
    this.updatePage();
  }

  /**
   * Called when one of the pagination settings is changed
   * @param event The new pagination data
   */
  onPaginationChange(event) {
    this.config.currentPage = event.page;
    this.config.pageSize = event.pageSize;
    this.sortConfig.field = event.sortField;
    this.sortConfig.direction = event.sortDirection;
    this.updatePage();
  }

  /**
   * Update the list of top communities
   */
  updatePage() {
    this.cds.findTop({
      currentPage: this.config.currentPage,
      elementsPerPage: this.config.pageSize,
      sort: { field: this.sortConfig.field, direction: this.sortConfig.direction }
    }).pipe(take(1)).subscribe((results) => {
      this.communitiesRD$.next(results);
    });
  }
}
