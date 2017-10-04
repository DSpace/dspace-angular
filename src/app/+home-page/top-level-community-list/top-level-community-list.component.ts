import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { RemoteData } from '../../core/data/remote-data';
import { CommunityDataService } from '../../core/data/community-data.service';
import { Community } from '../../core/shared/community.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortOptions, SortDirection } from '../../core/cache/models/sort-options.model';
import { ActivatedRoute } from '@angular/router';

import { fadeInOut } from '../../shared/animations/fade';

@Component({
  selector: 'ds-top-level-community-list',
  styleUrls: ['./top-level-community-list.component.scss'],
  templateUrl: './top-level-community-list.component.html',
  animations:[fadeInOut]
})
export class TopLevelCommunityListComponent {
  topLevelCommunities: RemoteData<Community[]>;
  config: PaginationComponentOptions;
  sortConfig: SortOptions;

  constructor(private cds: CommunityDataService) {
    this.config = new PaginationComponentOptions();
    this.config.id = 'top-level-pagination';
    this.config.pageSizeOptions = [4];
    this.config.pageSize = 4;
    this.config.currentPage = 1;
    this.sortConfig = new SortOptions();

    this.updatePage({
      page: this.config.currentPage,
      pageSize: this.config.pageSize,
      sortField: this.sortConfig.field,
      direction: this.sortConfig.direction
    });
  }

  updatePage(data) {
    this.topLevelCommunities = this.cds.findAll({
      currentPage: data.page,
      elementsPerPage: data.pageSize,
      sort: { field: data.sortField, direction: data.sortDirection }
    });
  }
}
