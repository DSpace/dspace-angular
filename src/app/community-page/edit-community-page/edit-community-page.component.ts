import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { getCommunityPageRoute } from '@dspace/core/router/utils/dso-route.utils';
import { Community } from '@dspace/core/shared/community.model';
import { TranslateModule } from '@ngx-translate/core';

import { EditComColPageComponent } from '../../shared/comcol/comcol-forms/edit-comcol-page/edit-comcol-page.component';

/**
 * Component that represents the page where a user can edit an existing Community
 */
@Component({
  selector: 'ds-edit-community',
  templateUrl: '../../shared/comcol/comcol-forms/edit-comcol-page/edit-comcol-page.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    RouterLink,
    RouterOutlet,
    TranslateModule,
  ],
})
export class EditCommunityPageComponent extends EditComColPageComponent<Community> {
  type = 'community';

  public constructor(
    protected router: Router,
    protected route: ActivatedRoute,
  ) {
    super(router, route);
  }

  /**
   * Get the community page url
   * @param community The community for which the url is requested
   */
  getPageUrl(community: Community): string {
    return getCommunityPageRoute(community.id);
  }
}
