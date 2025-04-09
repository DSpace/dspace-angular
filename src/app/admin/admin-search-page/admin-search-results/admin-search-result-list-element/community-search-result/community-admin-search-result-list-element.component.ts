import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { getCommunityEditRoute } from '../../../../../community-page/community-page-routing-paths';
import { Community } from '../../../../../core/shared/community.model';
import { Context } from '../../../../../core/shared/context.model';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { CommunitySearchResult } from '../../../../../shared/object-collection/shared/community-search-result.model';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { CommunitySearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/community-search-result/community-search-result-list-element.component';
import { SearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/search-result-list-element.component';

@listableObjectComponent(CommunitySearchResult, ViewMode.ListElement, Context.AdminSearch)
@Component({
  selector: 'ds-community-admin-search-result-list-element',
  styleUrls: ['./community-admin-search-result-list-element.component.scss'],
  templateUrl: './community-admin-search-result-list-element.component.html',
  standalone: true,
  imports: [CommunitySearchResultListElementComponent, RouterLink, TranslateModule],
})
/**
 * The component for displaying a list element for a community search result on the admin search page
 */
export class CommunityAdminSearchResultListElementComponent extends SearchResultListElementComponent<CommunitySearchResult, Community> {
  editPath: string;

  ngOnInit() {
    super.ngOnInit();
    this.editPath = getCommunityEditRoute(this.dso.uuid);
  }
}
