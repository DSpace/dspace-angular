import { Component } from '@angular/core';
import { ComcolMetadataComponent } from '../../../shared/comcol/comcol-forms/edit-comcol-page/comcol-metadata/comcol-metadata.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Community } from '../../../core/shared/community.model';
import { CommunityDataService } from '../../../core/data/community-data.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { CommunityFormComponent } from '../../community-form/community-form.component';
import { AsyncPipe } from '@angular/common';

/**
 * Component for editing a community's metadata
 */
@Component({
  selector: 'ds-community-metadata',
  templateUrl: './community-metadata.component.html',
  imports: [
    CommunityFormComponent,
    AsyncPipe
  ],
  standalone: true
})
export class CommunityMetadataComponent extends ComcolMetadataComponent<Community> {
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
