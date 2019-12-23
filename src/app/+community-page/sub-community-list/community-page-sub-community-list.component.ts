import { Component, Input, OnInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

import { RemoteData } from '../../core/data/remote-data';
import { Community } from '../../core/shared/community.model';
import { fadeIn } from '../../shared/animations/fade';
import { PaginatedList } from '../../core/data/paginated-list';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { CommunityDataService } from '../../core/data/community-data.service';

@Component({
  selector: 'ds-community-page-sub-community-list',
  styleUrls: ['./community-page-sub-community-list.component.scss'],
  templateUrl: './community-page-sub-community-list.component.html',
  animations: [fadeIn]
})
/**
 * Component to render the sub-communities of a Community
 */
export class CommunityPageSubCommunityListComponent implements OnInit {
  @Input() community: Community;

  /**
   * The pagination configuration
   */
  config: PaginationComponentOptions;

  /**
   * The pagination id
   */
  pageId = 'community-subCommunities-pagination';

  /**
   * The sorting configuration
   */
  sortConfig: SortOptions;

  /**
   * A list of remote data objects of communities' collections
   */
  subCommunitiesRDObs: BehaviorSubject<RemoteData<PaginatedList<Community>>> = new BehaviorSubject<RemoteData<PaginatedList<Community>>>({} as any);

  constructor(private cds: CommunityDataService) {
  }

  ngOnInit(): void {
    this.config = new PaginationComponentOptions();
    this.config.id = this.pageId;
    this.config.pageSize = 5;
    this.config.currentPage = 1;
    this.sortConfig = new SortOptions('dc.title', SortDirection.ASC);
    this.updatePage();
  }

  /**
   * Called when one of the pagination settings is changed
   * @param event The new pagination data
   */
  onPaginationChange(event) {
    this.config.currentPage = event.pagination.currentPage;
    this.config.pageSize = event.pagination.pageSize;
    this.sortConfig.field = event.sort.field;
    this.sortConfig.direction = event.sort.direction;
    this.updatePage();
  }

  /**
   * Update the list of sub-communities
   */
  updatePage() {
    this.cds.findByParent(this.community.id, {
      currentPage: this.config.currentPage,
      elementsPerPage: this.config.pageSize,
      sort: { field: this.sortConfig.field, direction: this.sortConfig.direction }
    }).pipe(take(1)).subscribe((results) => {
      this.subCommunitiesRDObs.next(results);
    });
  }
}
