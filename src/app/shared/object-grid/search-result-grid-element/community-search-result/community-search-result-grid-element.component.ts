import { Component } from '@angular/core';

import { Community } from '../../../../core/shared/community.model';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { SearchResultGridElementComponent } from '../search-result-grid-element.component';
import { ViewMode } from '../../../../+search-page/search-options.model';
import { CommunitySearchResult } from '../../../object-collection/shared/community-search-result.model';

@Component({
  selector: 'ds-community-search-result-grid-element',
  styleUrls: ['../search-result-grid-element.component.scss', 'community-search-result-grid-element.component.scss'],
  templateUrl: 'community-search-result-grid-element.component.html'
})

@renderElementsFor(CommunitySearchResult, ViewMode.Grid)
export class CommunitySearchResultGridElementComponent extends SearchResultGridElementComponent<CommunitySearchResult, Community> {

}