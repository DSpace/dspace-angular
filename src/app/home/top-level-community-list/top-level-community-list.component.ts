import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { RemoteData } from '../../core/data/remote-data';
import { CommunityDataService } from '../../core/data/community-data.service';
import { Community } from '../../core/shared/community.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortOptions, SortDirection } from '../../core/cache/models/sort-options.model';

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

  constructor(
    private cds: CommunityDataService,
    private ref: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.config = new PaginationComponentOptions();
    this.config.id = 'top-level-pagination';
    this.config.pageSizeOptions = [4];
    this.config.pageSize = 4;
    this.sortConfig = new SortOptions();

    this.updateResults();
  }

  onPageChange(currentPage: number): void {
    this.config.currentPage = currentPage;
    this.updateResults();
  }

  onPageSizeChange(elementsPerPage: number): void {
    this.config.pageSize = elementsPerPage;
    this.updateResults();
  }

  onSortDirectionChange(sortDirection: SortDirection): void {
    this.sortConfig = new SortOptions(this.sortConfig.field, sortDirection);
    this.updateResults();
  }

  onSortFieldChange(field: string): void {
    this.sortConfig = new SortOptions(field, this.sortConfig.direction);
    this.updateResults();
  }

  updateResults() {
    this.topLevelCommunities = undefined;
    this.topLevelCommunities = this.cds.findAll({ currentPage: this.config.currentPage, elementsPerPage: this.config.pageSize, sort: this.sortConfig });
    // this.ref.detectChanges();
  }
}
