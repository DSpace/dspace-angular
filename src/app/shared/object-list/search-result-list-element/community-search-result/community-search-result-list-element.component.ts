import { Component } from '@angular/core';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';

import { SearchResultListElementComponent } from '../search-result-list-element.component';
import { Community } from '../../../../core/shared/community.model';
import { SetViewMode } from '../../../view-mode';
import { CommunitySearchResult } from '../../../object-collection/shared/community-search-result.model';

@Component({
  selector: 'ds-community-search-result-list-element',
  styleUrls: ['../search-result-list-element.component.scss', 'community-search-result-list-element.component.scss'],
  templateUrl: 'community-search-result-list-element.component.html'
})

@renderElementsFor(CommunitySearchResult, SetViewMode.List)
export class CommunitySearchResultListElementComponent extends SearchResultListElementComponent<CommunitySearchResult, Community> {

}
