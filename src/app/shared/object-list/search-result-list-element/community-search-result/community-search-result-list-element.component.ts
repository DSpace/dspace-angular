import { NgClass } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Community } from '../../../../core/shared/community.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { ThemedBadgesComponent } from '../../../object-collection/shared/badges/themed-badges.component';
import { CommunitySearchResult } from '../../../object-collection/shared/community-search-result.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { SearchResultListElementComponent } from '../search-result-list-element.component';

@Component({
  selector: 'ds-community-search-result-list-element',
  styleUrls: ['../search-result-list-element.component.scss', 'community-search-result-list-element.component.scss'],
  templateUrl: 'community-search-result-list-element.component.html',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    ThemedBadgesComponent,
  ],
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
