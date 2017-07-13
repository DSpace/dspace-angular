import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { Community } from '../core/shared/community.model';
import { Bitstream } from '../core/shared/bitstream.model';
import { RemoteData } from '../core/data/remote-data';
import { CommunityDataService } from '../core/data/community-data.service';
import { hasValue } from '../shared/empty.util';

@Component({
  selector: 'ds-community-page',
  styleUrls: ['./community-page.component.scss'],
  templateUrl: './community-page.component.html',
})
export class CommunityPageComponent implements OnInit, OnDestroy {
  communityData: RemoteData<Community>;
  logoData: RemoteData<Bitstream>;
  private subs: Subscription[] = [];

  constructor(
    private communityDataService: CommunityDataService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.communityData = this.communityDataService.findById(params.id);
      this.subs.push(this.communityData.payload
        .subscribe((community) => this.logoData = community.logo));
    });
  }

  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

}
