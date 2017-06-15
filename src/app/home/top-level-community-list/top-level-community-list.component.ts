import { Component, OnInit } from '@angular/core';
import { RemoteData } from "../../core/data/remote-data";
import { ItemDataService } from "../../core/data/item-data.service";
import { Item } from "../../core/shared/item.model";
import { PaginationComponentOptions } from "../../shared/pagination/pagination-component-options.model";
import { SortOptions } from "../../core/cache/models/sort-options.model";

@Component({
  selector: 'ds-top-level-community-list',
  styleUrls: ['./top-level-community-list.component.css'],
  templateUrl: './top-level-community-list.component.html'
})
export class TopLevelCommunityListComponent implements OnInit {
  topLevelCommunities: RemoteData<Item[]>;
  config : PaginationComponentOptions;
  sortConfig : SortOptions;

  constructor(
    private cds: ItemDataService
  ) {
    this.universalInit();
  }

  universalInit() {

  }

  ngOnInit(): void {
    this.topLevelCommunities = this.cds.findAll();
    this.config = new PaginationComponentOptions();
    this.config.id = "top-level-pagination"
    this.config.pageSizeOptions = [ 5, 10, 20, 40, 60, 80, 100 ];

    this.sortConfig =  new SortOptions();
  }

  onPageChange(currentPage): void {
    this.config.currentPage = currentPage;
    this.updateResults();
  }

  onPageSizeChange(elementsPerPage): void {
    this.config.pageSize = elementsPerPage;
    this.updateResults();
  }

  onSortDirectionChange(sortDirection): void {
    this.sortConfig.direction = sortDirection;
    this.updateResults();
  }

  onSortFieldChange(field): void {
    this.sortConfig.field = field;
    this.updateResults();
  }

  updateResults() {
    this.topLevelCommunities = this.cds.findAll({ currentPage: this.config.currentPage, elementsPerPage: this.config.pageSize, sort: this.sortConfig });
  }
}
