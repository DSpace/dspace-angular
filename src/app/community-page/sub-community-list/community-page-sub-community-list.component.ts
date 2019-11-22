import { Component, Input, OnInit } from '@angular/core';

import { RemoteData } from '../../core/data/remote-data';
import { Community } from '../../core/shared/community.model';

import { fadeIn } from '../../shared/animations/fade';
import { PaginatedList } from '../../core/data/paginated-list';
import {Observable} from 'rxjs';

@Component({
  selector: 'ds-community-page-sub-community-list',
  styleUrls: ['./community-page-sub-community-list.component.scss'],
  templateUrl: './community-page-sub-community-list.component.html',
  animations:[fadeIn]
})
/**
 * Component to render the sub-communities of a Community
 */
export class CommunityPageSubCommunityListComponent implements OnInit {
  @Input() community: Community;
  subCommunitiesRDObs: Observable<RemoteData<PaginatedList<Community>>>;

  ngOnInit(): void {
    this.subCommunitiesRDObs = this.community.subcommunities;
  }
}
