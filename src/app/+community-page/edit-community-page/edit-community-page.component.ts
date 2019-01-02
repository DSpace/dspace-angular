import { Component } from '@angular/core';
import { Community } from '../../core/shared/community.model';
import { CommunityDataService } from '../../core/data/community-data.service';
import { RouteService } from '../../shared/services/route.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NormalizedCommunity } from '../../core/cache/models/normalized-community.model';
import { EditComColPageComponent } from '../../shared/comcol-forms/edit-comcol-page/edit-comcol-page.component';

/**
 * Component that represents the page where a user can edit an existing Community
 */
@Component({
  selector: 'ds-edit-community',
  styleUrls: ['./edit-community-page.component.scss'],
  templateUrl: './edit-community-page.component.html'
})
export class EditCommunityPageComponent extends EditComColPageComponent<Community, NormalizedCommunity> {
  protected frontendURL = '/communities/';

  public constructor(
    protected communityDataService: CommunityDataService,
    protected routeService: RouteService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(communityDataService, routeService, router, route);
  }
}
