import { Component } from '@angular/core';
import { SearchResultListElementComponent } from '../search-result-list-element.component';
import { Community } from '../../../../core/shared/community.model';
import { CommunitySearchResult } from '../../../object-collection/shared/community-search-result.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { RouterLink } from '@angular/router';
import { ThemedBadgesComponent } from '../../../object-collection/shared/badges/themed-badges.component';
import { NgIf, NgClass } from '@angular/common';

@Component({
    selector: 'ds-community-search-result-list-element',
    styleUrls: ['../search-result-list-element.component.scss', 'community-search-result-list-element.component.scss'],
    templateUrl: 'community-search-result-list-element.component.html',
    standalone: true,
    imports: [NgIf, NgClass, ThemedBadgesComponent, RouterLink]
})
/**
 * Component representing a community search result in list view
 */
@listableObjectComponent(CommunitySearchResult, ViewMode.ListElement)
export class CommunitySearchResultListElementComponent extends SearchResultListElementComponent<CommunitySearchResult, Community> {
  /**
   * Display thumbnails if required by configuration
   */
  showThumbnails: boolean;


  ngOnInit(): void {
    super.ngOnInit();
    this.showThumbnails = this.showThumbnails ?? this.appConfig.browseBy.showThumbnails;
  }
}
