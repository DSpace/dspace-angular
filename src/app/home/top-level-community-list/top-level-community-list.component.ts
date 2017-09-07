import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { RemoteData } from '../../core/data/remote-data';
import { CommunityDataService } from '../../core/data/community-data.service';
import { Community } from '../../core/shared/community.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortOptions, SortDirection } from '../../core/cache/models/sort-options.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ds-top-level-community-list',
  styleUrls: ['./top-level-community-list.component.scss'],
  templateUrl: './top-level-community-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopLevelCommunityListComponent implements OnInit {
  topLevelCommunities: RemoteData<Community[]>;
  config: PaginationComponentOptions;
  sortConfig: SortOptions;
  private sub;

  constructor(
    private cds: CommunityDataService,
    private route: ActivatedRoute
  ) {
    this.config = new PaginationComponentOptions();
    this.config.id = 'top-level-pagination';
    this.config.pageSizeOptions = [4];
    this.config.pageSize = 4;
    this.sortConfig = new SortOptions();
  }

  ngOnInit(): void {

    this.sub = this.route
      .queryParams
      .subscribe((params) => {
        this.topLevelCommunities = this.cds.findAll({
          currentPage: params.page,
          elementsPerPage: params.pageSize,
          sort: { field: params.sortField, direction: params.sortDirection }
        });
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
