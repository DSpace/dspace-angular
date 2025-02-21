import { NgClass } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { CommunitySearchResult } from '../../../../../../modules/core/src/lib/core/object-collection/community-search-result.model';
import { Community } from '../../../../../../modules/core/src/lib/core/shared/community.model';
import { ViewMode } from '../../../../../../modules/core/src/lib/core/shared/view-mode.model';
import { ThemedBadgesComponent } from '../../../object-collection/shared/badges/themed-badges.component';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { SearchResultListElementComponent } from '../search-result-list-element.component';

@Component({
  selector: 'ds-community-search-result-list-element',
  styleUrls: ['../search-result-list-element.component.scss', 'community-search-result-list-element.component.scss'],
  templateUrl: 'community-search-result-list-element.component.html',
  standalone: true,
  imports: [NgClass, ThemedBadgesComponent, RouterLink],
})
/**
 * Component representing a community search result in list view
 */
@listableObjectComponent(CommunitySearchResult, ViewMode.ListElement)
export class CommunitySearchResultListElementComponent extends SearchResultListElementComponent<CommunitySearchResult, Community> implements OnInit {
  /**
   * Display thumbnails if required by configuration
   */
  showThumbnails: boolean;

  ngOnInit(): void {
    super.ngOnInit();
    this.showThumbnails = this.showThumbnails ?? this.appConfig.browseBy.showThumbnails;
  }
}
