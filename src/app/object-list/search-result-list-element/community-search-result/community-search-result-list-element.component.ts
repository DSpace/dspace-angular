import { Component } from '@angular/core';

import { listElementFor } from '../../list-element-decorator';
import { CommunitySearchResult } from './community-search-result.model';
import { SearchResultListElementComponent } from '../search-result-list-element.component';
import { Community } from '../../../core/shared/community.model';

@Component({
  selector: 'ds-community-search-result-list-element',
  styleUrls: ['community-search-result-list-element.component.scss'],
  templateUrl: 'community-search-result-list-element.component.html'
})

@listElementFor(CommunitySearchResult)
export class CommunitySearchResultListElementComponent extends SearchResultListElementComponent<CommunitySearchResult, Community> {

}
