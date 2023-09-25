import { Component } from '@angular/core';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { ItemSearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';
import { ThemedBadgesComponent } from '../../../../../shared/object-collection/shared/badges/themed-badges.component';
import { TruncatableComponent } from '../../../../../shared/truncatable/truncatable.component';
import { ThumbnailComponent } from '../../../../../thumbnail/thumbnail.component';
import { RouterLink } from '@angular/router';
import { NgIf, NgClass, AsyncPipe } from '@angular/common';

@listableObjectComponent('ProjectSearchResult', ViewMode.ListElement)
@Component({
    selector: 'ds-project-search-result-list-element',
    styleUrls: ['./project-search-result-list-element.component.scss'],
    templateUrl: './project-search-result-list-element.component.html',
    standalone: true,
    imports: [NgIf, RouterLink, ThumbnailComponent, NgClass, TruncatableComponent, ThemedBadgesComponent, AsyncPipe]
})
/**
 * The component for displaying a list element for an item search result of the type Project
 */
export class ProjectSearchResultListElementComponent extends ItemSearchResultListElementComponent {

}
