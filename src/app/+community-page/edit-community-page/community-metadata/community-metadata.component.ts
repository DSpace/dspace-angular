import { Component } from '@angular/core';
import { ComcolMetadataComponent } from '../../../shared/comcol-forms/edit-comcol-page/comcol-metadata/comcol-metadata.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Community } from '../../../core/shared/community.model';
import { CommunityDataService } from '../../../core/data/community-data.service';

/**
 * Component for editing a community's metadata
 */
@Component({
  selector: 'ds-community-metadata',
  templateUrl: './community-metadata.component.html',
})
export class CommunityMetadataComponent extends ComcolMetadataComponent<Community> {
  protected frontendURL = '/communities/';

  public constructor(
    protected communityDataService: CommunityDataService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(communityDataService, router, route);
  }
}
