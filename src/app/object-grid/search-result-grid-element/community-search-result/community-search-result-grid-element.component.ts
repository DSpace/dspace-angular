import { Component } from '@angular/core';

import { CommunitySearchResult } from './community-search-result.model';
import { Community } from '../../../core/shared/community.model';
import { gridElementFor } from '../../grid-element-decorator';
import { SearchResultGridElementComponent } from '../search-result-grid-element.component';

@Component({
  selector: 'ds-community-search-result-grid-element',
  styleUrls: ['../search-result-grid-element.component.scss', 'community-search-result-grid-element.component.scss'],
  templateUrl: 'community-search-result-grid-element.component.html'
})

@gridElementFor(CommunitySearchResult)
export class CommunitySearchResultGridElementComponent extends SearchResultGridElementComponent<CommunitySearchResult, Community> {

}
