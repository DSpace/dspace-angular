import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { ThemedBadgesComponent } from '../../../../../shared/object-collection/shared/badges/themed-badges.component';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ItemSearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';
import { TruncatableComponent } from '../../../../../shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../../shared/truncatable/truncatable-part/truncatable-part.component';
import { ThemedThumbnailComponent } from '../../../../../thumbnail/themed-thumbnail.component';

@listableObjectComponent('JournalIssueSearchResult', ViewMode.ListElement)
@Component({
  selector: 'ds-journal-issue-search-result-list-element',
  styleUrls: ['./journal-issue-search-result-list-element.component.scss'],
  templateUrl: './journal-issue-search-result-list-element.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    RouterLink,
    ThemedBadgesComponent,
    ThemedThumbnailComponent,
    TruncatableComponent,
    TruncatablePartComponent,
  ],
})
/**
 * The component for displaying a list element for an item search result of the type Journal Issue
 */
export class JournalIssueSearchResultListElementComponent extends ItemSearchResultListElementComponent {

}
