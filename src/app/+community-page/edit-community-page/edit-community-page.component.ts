import { Component } from '@angular/core';
import { Community } from '../../core/shared/community.model';
import { CommunityDataService } from '../../core/data/community-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EditComColPageComponent } from '../../shared/comcol-forms/edit-comcol-page/edit-comcol-page.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';

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
  protected type = Community.type;

  public constructor(
    protected communityDataService: CommunityDataService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService
  ) {
    super(communityDataService, router, route, notificationsService, translate);
  }
}
