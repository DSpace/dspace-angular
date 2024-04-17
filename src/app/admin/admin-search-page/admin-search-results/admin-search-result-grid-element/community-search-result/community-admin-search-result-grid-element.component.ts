import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import { getCommunityEditRoute } from '../../../../../community-page/community-page-routing-paths';
import { Community } from '../../../../../core/shared/community.model';
import { Context } from '../../../../../core/shared/context.model';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { CommunitySearchResult } from '../../../../../shared/object-collection/shared/community-search-result.model';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { CommunitySearchResultGridElementComponent } from '../../../../../shared/object-grid/search-result-grid-element/community-search-result/community-search-result-grid-element.component';
import { SearchResultGridElementComponent } from '../../../../../shared/object-grid/search-result-grid-element/search-result-grid-element.component';

@listableObjectComponent(CommunitySearchResult, ViewMode.GridElement, Context.AdminSearch)
@Component({
  selector: 'ds-community-admin-search-result-grid-element',
  styleUrls: ['./community-admin-search-result-grid-element.component.scss'],
  templateUrl: './community-admin-search-result-grid-element.component.html',
  standalone: true,
  imports: [CommunitySearchResultGridElementComponent, RouterLink, FontAwesomeModule],
})
/**
 * The component for displaying a list element for a community search result on the admin search page
 */
export class CommunityAdminSearchResultGridElementComponent extends SearchResultGridElementComponent<CommunitySearchResult, Community> {
  protected readonly faEdit = faEdit;

  editPath: string;

  ngOnInit() {
    super.ngOnInit();
    this.editPath = getCommunityEditRoute(this.dso.uuid);
  }
}
