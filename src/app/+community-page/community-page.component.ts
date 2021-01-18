import { mergeMap, filter, map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { CommunityDataService } from '../core/data/community-data.service';
import { RemoteData } from '../core/data/remote-data';
import { Bitstream } from '../core/shared/bitstream.model';

import { Community } from '../core/shared/community.model';

import { MetadataService } from '../core/metadata/metadata.service';

import { fadeInOut } from '../shared/animations/fade';
import { hasValue } from '../shared/empty.util';
import { redirectOn4xx } from '../core/shared/operators';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'ds-community-page',
  styleUrls: ['./community-page.component.scss'],
  templateUrl: './community-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut]
})
/**
 * This component represents a detail page for a single community
 */
export class CommunityPageComponent implements OnInit {
  /**
   * The community displayed on this page
   */
  communityRD$: Observable<RemoteData<Community>>;

  /**
   * The logo of this community
   */
  logoRD$: Observable<RemoteData<Bitstream>>;
  constructor(
    private communityDataService: CommunityDataService,
    private metadata: MetadataService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {

  }

  ngOnInit(): void {
    this.communityRD$ = this.route.data.pipe(
      map((data) => data.dso as RemoteData<Community>),
      redirectOn4xx(this.router, this.authService)
    );
    this.logoRD$ = this.communityRD$.pipe(
      map((rd: RemoteData<Community>) => rd.payload),
      filter((community: Community) => hasValue(community)),
      mergeMap((community: Community) => community.logo));
  }

}
