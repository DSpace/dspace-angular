import { Component } from '@angular/core';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';

import { SearchResultListElementComponent } from '../search-result-list-element.component';
import { Community } from '../../../../core/shared/community.model';
import { CommunitySearchResult } from '../../../object-collection/shared/community-search-result.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';

@Component({
  selector: 'ds-community-search-result-list-element',
  styleUrls: ['../search-result-list-element.component.scss', 'community-search-result-list-element.component.scss'],
  templateUrl: 'community-search-result-list-element.component.html'
})

@renderElementsFor(CommunitySearchResult, ViewMode.List)
export class CommunitySearchResultListElementComponent extends SearchResultListElementComponent<CommunitySearchResult, Community> {

}
