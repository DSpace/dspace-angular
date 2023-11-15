import { Component } from '@angular/core';
import { Context } from '../../../../../../../../app/core/shared/context.model';
import { Item } from '../../../../../../../../app/core/shared/item.model';
import { ViewMode } from '../../../../../../../../app/core/shared/view-mode.model';
import { focusShadow } from '../../../../../../../../app/shared/animations/focus';
import { listableObjectComponent } from '../../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { ItemGridElementComponent as BaseComponent } from '../../../../../../../../app/shared/object-grid/item-grid-element/item-types/item/item-grid-element.component';

@listableObjectComponent('Publication', ViewMode.GridElement, Context.Any, 'image-gallery')
@listableObjectComponent(Item, ViewMode.GridElement, Context.Any, 'image-gallery')
@Component({
  selector: 'ds-item-grid-element',
  styleUrls: ['../../../../../../../../app/shared/object-grid/item-grid-element/item-types/item/item-grid-element.component.scss'],
  templateUrl: './item-grid-element.component.html',
  animations: [focusShadow]
})
/**
 * The component for displaying a grid element for an item of the type Publication
 */
export class ItemGridElementComponent extends BaseComponent {
}
