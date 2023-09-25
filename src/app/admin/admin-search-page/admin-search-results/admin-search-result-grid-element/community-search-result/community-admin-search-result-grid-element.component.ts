import { Component } from '@angular/core';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../../core/shared/context.model';
import { CommunitySearchResult } from '../../../../../shared/object-collection/shared/community-search-result.model';
import { Community } from '../../../../../core/shared/community.model';
import { SearchResultGridElementComponent } from '../../../../../shared/object-grid/search-result-grid-element/search-result-grid-element.component';
import { getCommunityEditRoute } from '../../../../../community-page/community-page-routing-paths';
import { RouterLink } from '@angular/router';
import { CommunitySearchResultGridElementComponent } from '../../../../../shared/object-grid/search-result-grid-element/community-search-result/community-search-result-grid-element.component';

@listableObjectComponent(CommunitySearchResult, ViewMode.GridElement, Context.AdminSearch)
@Component({
    selector: 'ds-community-admin-search-result-grid-element',
    styleUrls: ['./community-admin-search-result-grid-element.component.scss'],
    templateUrl: './community-admin-search-result-grid-element.component.html',
    standalone: true,
    imports: [CommunitySearchResultGridElementComponent, RouterLink]
})
/**
 * The component for displaying a list element for a community search result on the admin search page
 */
export class CommunityAdminSearchResultGridElementComponent extends SearchResultGridElementComponent<CommunitySearchResult, Community> {
  editPath: string;

  ngOnInit() {
    super.ngOnInit();
    this.editPath = getCommunityEditRoute(this.dso.uuid);
  }
}
