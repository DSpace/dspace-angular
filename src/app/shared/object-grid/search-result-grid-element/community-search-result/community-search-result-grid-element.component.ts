import { Component } from '@angular/core';
import { Community } from '../../../../core/shared/community.model';
import { SearchResultGridElementComponent } from '../search-result-grid-element.component';
import { CommunitySearchResult } from '../../../object-collection/shared/community-search-result.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';

@Component({
  selector: 'ds-community-search-result-grid-element',
  styleUrls: ['../search-result-grid-element.component.scss', 'community-search-result-grid-element.component.scss'],
  templateUrl: 'community-search-result-grid-element.component.html'
})
/**
 * Component representing a grid element for a community search result
 */
@listableObjectComponent(CommunitySearchResult, ViewMode.GridElement)
export class CommunitySearchResultGridElementComponent extends SearchResultGridElementComponent<CommunitySearchResult, Community> {
}
