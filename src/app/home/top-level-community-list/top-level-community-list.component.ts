import { Component, OnInit } from '@angular/core';
import { RemoteData } from "../../core/data/remote-data";
import { ItemDataService } from "../../core/data/item-data.service";
import { Item } from "../../core/shared/item.model";
import { PaginationOptions } from "../../core/cache/models/pagination-options.model";

@Component({
  selector: 'ds-top-level-community-list',
  styleUrls: ['./top-level-community-list.component.css'],
  templateUrl: './top-level-community-list.component.html'
})
export class TopLevelCommunityListComponent implements OnInit {
  topLevelCommunities: RemoteData<Item[]>;
  config : PaginationOptions;

  constructor(
    private cds: ItemDataService
  ) {
    this.universalInit();
  }

  universalInit() {

  }

  ngOnInit(): void {
    this.topLevelCommunities = this.cds.findAll();
    this.config = new PaginationOptions();
    this.config.id = "top-level-pagination"
    this.config.pageSizeOptions = [ 5, 10, 20, 40, 60, 80, 100 ];
  }
}
