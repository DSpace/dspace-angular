import { Component } from '@angular/core';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { ItemSearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';
import { TruncatablePartComponent } from '../../../../../shared/truncatable/truncatable-part/truncatable-part.component';
import { TruncatableComponent } from '../../../../../shared/truncatable/truncatable.component';
import { ThemedBadgesComponent } from '../../../../../shared/object-collection/shared/badges/themed-badges.component';
import { ThumbnailComponent } from '../../../../../thumbnail/thumbnail.component';
import { RouterLink } from '@angular/router';
import { NgIf, NgClass, NgFor, AsyncPipe } from '@angular/common';

@listableObjectComponent('JournalSearchResult', ViewMode.ListElement)
@Component({
    selector: 'ds-journal-search-result-list-element',
    styleUrls: ['./journal-search-result-list-element.component.scss'],
    templateUrl: './journal-search-result-list-element.component.html',
    standalone: true,
    imports: [NgIf, RouterLink, ThumbnailComponent, NgClass, ThemedBadgesComponent, TruncatableComponent, TruncatablePartComponent, NgFor, AsyncPipe]
})
/**
 * The component for displaying a list element for an item search result of the type Journal
 */
export class JournalSearchResultListElementComponent extends ItemSearchResultListElementComponent {

}
