import { Component, Input, OnInit } from '@angular/core';

import { CommunityDataService } from '../../core/data/community-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { Collection } from '../../core/shared/collection.model';
import { NormalizedCollection } from '../../core/cache/models/normalized-collection.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';

@Component({
  selector: 'ds-community-page-sub-collection-list',
  styleUrls: ['./community-page-sub-collection-list.component.scss'],
  templateUrl: './community-page-sub-collection-list.component.html',
})
export class CommunityPageSubCollectionListComponent implements OnInit {
  @Input() communityId;

  hideGear = true;
  hidePagerWhenSinglePage = true;
  config: PaginationComponentOptions;
  sortConfig: SortOptions;
  subCollections: RemoteData<Collection[]>;

  constructor(private cds: CommunityDataService) {

  }

  ngOnInit(): void {
    this.config = new PaginationComponentOptions();
    this.config.id = 'community-browse';
    this.config.pageSizeOptions = [1, 5, 10, 20];
    this.config.pageSize = 10;
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
    this.subCollections = this.cds.findEmbedded<NormalizedCollection, Collection>(
      this.communityId,
      'collections',
      NormalizedCollection,
      {
        currentPage: this.config.currentPage,
        elementsPerPage: this.config.pageSize,
        sort: this.sortConfig
      });
  }
}
