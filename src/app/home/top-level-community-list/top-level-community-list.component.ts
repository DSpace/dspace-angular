import { Component, OnInit } from '@angular/core';
import { CommunityDataService } from "../../core/data/community-data.service";
import { RemoteData } from "../../core/data/remote-data";
import { Community } from "../../core/shared/community.model";

@Component({
  selector: 'ds-top-level-community-list',
  styleUrls: ['./top-level-community-list.component.css'],
  templateUrl: './top-level-community-list.component.html'
})
export class TopLevelCommunityListComponent implements OnInit {
  topLevelCommunities: RemoteData<Community[]>;

  constructor(
    private cds: CommunityDataService
  ) {
    this.universalInit();
  }

  universalInit() {

  }

  ngOnInit(): void {
    this.topLevelCommunities = this.cds.findAll();
  }
}
