import { CommunityDataService } from '../../data/community-data.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Community } from '../community.model';
import { followLink, FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { Store } from '@ngrx/store';
import { EditDsoResolver } from './edit-dso.resolver';

/**
 * This class represents a resolver that requests a specific Community before the route is activated
 */
@Injectable()
export class EditCommunityResolver extends EditDsoResolver {
  constructor(
    protected communitydataService: CommunityDataService,
    protected store: Store<Community>,
    protected router: Router
  ) {
    super(communitydataService, store, router);
  }

  getFollowLinks(): FollowLinkConfig<Community>[] {
    return [];
  }
}
