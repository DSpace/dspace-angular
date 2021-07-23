import { Component } from '@angular/core';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { AbstractListableElementComponent } from '../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';
import { Item } from '../../../../core/shared/item.model';

@listableObjectComponent('IIIF', ViewMode.GridElement)
@Component({
  selector: 'ds-iiif-grid-element',
  styleUrls: ['./iiif-grid-element.component.scss'],
  templateUrl: './iiif-grid-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type IIIF.
 */
export class IIIFGridElementComponent extends AbstractListableElementComponent<Item> {
}
