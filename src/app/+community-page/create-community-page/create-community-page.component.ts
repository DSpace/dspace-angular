import { Component } from '@angular/core';
import { Community } from '../../core/shared/community.model';
import { CommunityDataService } from '../../core/data/community-data.service';
import { RouteService } from '../../core/services/route.service';
import { Router } from '@angular/router';
import { CreateComColPageComponent } from '../../shared/comcol-forms/create-comcol-page/create-comcol-page.component';

/**
 * Component that represents the page where a user can create a new Community
 */
@Component({
  selector: 'ds-create-community',
  styleUrls: ['./create-community-page.component.scss'],
  templateUrl: './create-community-page.component.html'
})
export class CreateCommunityPageComponent extends CreateComColPageComponent<Community> {
  protected frontendURL = '/communities/';

  public constructor(
    protected communityDataService: CommunityDataService,
    protected routeService: RouteService,
    protected router: Router
  ) {
    super(communityDataService, communityDataService, routeService, router);
  }
}
