import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Community } from '@dspace/core/shared/community.model';
import { Context } from '@dspace/core/shared/context.model';
import { CommunitySearchResult } from '@dspace/core/shared/object-collection/community-search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';

import { getCommunityEditRoute } from '../../../../../community-page/community-page-routing-paths';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { CommunitySearchResultGridElementComponent } from '../../../../../shared/object-grid/search-result-grid-element/community-search-result/community-search-result-grid-element.component';
import { SearchResultGridElementComponent } from '../../../../../shared/object-grid/search-result-grid-element/search-result-grid-element.component';

@listableObjectComponent(CommunitySearchResult, ViewMode.GridElement, Context.AdminSearch)
@Component({
  selector: 'ds-community-admin-search-result-grid-element',
  styleUrls: ['./community-admin-search-result-grid-element.component.scss'],
  templateUrl: './community-admin-search-result-grid-element.component.html',
  standalone: true,
  imports: [
    CommunitySearchResultGridElementComponent,
    RouterLink,
  ],
})
/**
 * The component for displaying a list element for a community search result on the admin search page
 */
export class CommunityAdminSearchResultGridElementComponent extends SearchResultGridElementComponent<CommunitySearchResult, Community> implements OnInit {
  editPath: string;

  ngOnInit(): void {
    super.ngOnInit();
    this.editPath = getCommunityEditRoute(this.dso.uuid);
  }
}
