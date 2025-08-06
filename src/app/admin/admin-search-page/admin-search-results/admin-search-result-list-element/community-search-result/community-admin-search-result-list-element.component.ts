import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Community } from '@dspace/core/shared/community.model';
import { Context } from '@dspace/core/shared/context.model';
import { CommunitySearchResult } from '@dspace/core/shared/object-collection/community-search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { TranslateModule } from '@ngx-translate/core';

import { getCommunityEditRoute } from '../../../../../community-page/community-page-routing-paths';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { CommunitySearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/community-search-result/community-search-result-list-element.component';
import { SearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/search-result-list-element.component';

@listableObjectComponent(CommunitySearchResult, ViewMode.ListElement, Context.AdminSearch)
@Component({
  selector: 'ds-community-admin-search-result-list-element',
  styleUrls: ['./community-admin-search-result-list-element.component.scss'],
  templateUrl: './community-admin-search-result-list-element.component.html',
  standalone: true,
  imports: [
    CommunitySearchResultListElementComponent,
    RouterLink,
    TranslateModule,
  ],
})
/**
 * The component for displaying a list element for a community search result on the admin search page
 */
export class CommunityAdminSearchResultListElementComponent extends SearchResultListElementComponent<CommunitySearchResult, Community> implements OnInit {
  editPath: string;

  ngOnInit(): void {
    super.ngOnInit();
    this.editPath = getCommunityEditRoute(this.dso.uuid);
  }
}
