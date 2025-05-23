import { NgClass } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Collection } from '../../../../core/shared/collection.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { ThemedBadgesComponent } from '../../../object-collection/shared/badges/themed-badges.component';
import { CollectionSearchResult } from '../../../object-collection/shared/collection-search-result.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { SearchResultListElementComponent } from '../search-result-list-element.component';

@Component({
  selector: 'ds-collection-search-result-list-element',
  styleUrls: ['../search-result-list-element.component.scss', 'collection-search-result-list-element.component.scss'],
  templateUrl: 'collection-search-result-list-element.component.html',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    ThemedBadgesComponent,
  ],
})
/**
 * Component representing a collection search result in list view
 */
@listableObjectComponent(CollectionSearchResult, ViewMode.ListElement)
export class CollectionSearchResultListElementComponent extends SearchResultListElementComponent<CollectionSearchResult, Collection> implements OnInit {

  /**
   * Display thumbnails if required by configuration
   */
  showThumbnails: boolean;

  ngOnInit(): void {
    super.ngOnInit();
    this.showThumbnails = this.showThumbnails ?? this.appConfig.browseBy.showThumbnails;
  }

}
