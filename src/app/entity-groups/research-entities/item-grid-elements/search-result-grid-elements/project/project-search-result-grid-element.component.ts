import { Component } from '@angular/core';
import {
  listableObjectComponent
} from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { focusShadow } from '../../../../../shared/animations/focus';
import {
  ItemSearchResultGridElementComponent
} from '../../../../../shared/object-grid/search-result-grid-element/item-search-result/item/item-search-result-grid-element.component';
import { TranslateModule } from '@ngx-translate/core';
import { TruncatablePartComponent } from '../../../../../shared/truncatable/truncatable-part/truncatable-part.component';
import { ThemedBadgesComponent } from '../../../../../shared/object-collection/shared/badges/themed-badges.component';
import { ThemedThumbnailComponent } from '../../../../../thumbnail/themed-thumbnail.component';
import { RouterLink } from '@angular/router';
import { NgIf, AsyncPipe } from '@angular/common';
import { TruncatableComponent } from '../../../../../shared/truncatable/truncatable.component';

@listableObjectComponent('ProjectSearchResult', ViewMode.GridElement)
@Component({
    selector: 'ds-project-search-result-grid-element',
    styleUrls: ['./project-search-result-grid-element.component.scss'],
    templateUrl: './project-search-result-grid-element.component.html',
    animations: [focusShadow],
    standalone: true,
    imports: [TruncatableComponent, NgIf, RouterLink, ThemedThumbnailComponent, ThemedBadgesComponent, TruncatablePartComponent, AsyncPipe, TranslateModule]
})
/**
 * The component for displaying a grid element for an item search result of the type Project
 */
export class ProjectSearchResultGridElementComponent extends ItemSearchResultGridElementComponent {
}
