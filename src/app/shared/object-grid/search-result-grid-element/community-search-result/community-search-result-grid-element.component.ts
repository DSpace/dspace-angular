import { Component } from '@angular/core';

import { CommunitySearchResult } from './community-search-result.model';
import { Community } from '../../../../core/shared/community.model';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { SearchResultGridElementComponent } from '../search-result-grid-element.component';
import { ViewMode } from '../../../../+search-page/search-options.model';

@Component({
  selector: 'ds-community-search-result-grid-element',
  styleUrls: ['../search-result-grid-element.component.scss', 'community-search-result-grid-element.component.scss'],
  templateUrl: 'community-search-result-grid-element.component.html'
})

@renderElementsFor(CommunitySearchResult, ViewMode.Grid)
export class CommunitySearchResultGridElementComponent extends SearchResultGridElementComponent<CommunitySearchResult, Community> {

}
