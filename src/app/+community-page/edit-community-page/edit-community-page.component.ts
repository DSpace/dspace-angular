import { Component } from '@angular/core';
import { Community } from '../../core/shared/community.model';
import { CommunityDataService } from '../../core/data/community-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EditComColPageComponent } from '../../shared/comcol-forms/edit-comcol-page/edit-comcol-page.component';

/**
 * Component that represents the page where a user can edit an existing Community
 */
@Component({
  selector: 'ds-edit-community',
  styleUrls: ['./edit-community-page.component.scss'],
  templateUrl: './edit-community-page.component.html'
})
export class EditCommunityPageComponent extends EditComColPageComponent<Community> {
  protected frontendURL = '/communities/';

  public constructor(
    protected communityDataService: CommunityDataService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(communityDataService, router, route);
  }
}
