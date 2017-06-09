import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Community } from "../core/shared/community.model";
import { Bitstream } from "../core/shared/bitstream.model";
import { RemoteData } from "../core/data/remote-data";
import { CommunityDataService } from "../core/data/community-data.service";

@Component({
  selector: 'ds-community-page',
  styleUrls: ['./community-page.component.css'],
  templateUrl: './community-page.component.html',
})
export class CommunityPageComponent implements OnInit {
  communityData: RemoteData<Community>;
  logoData: RemoteData<Bitstream>;

  constructor(
    private communityDataService: CommunityDataService,
    private route: ActivatedRoute
  ) {
    this.universalInit();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.communityData = this.communityDataService.findById(params['id'])
      this.communityData.payload
        .subscribe(community => this.logoData = community.logo);
    });
  }

  universalInit() {
  }
}
