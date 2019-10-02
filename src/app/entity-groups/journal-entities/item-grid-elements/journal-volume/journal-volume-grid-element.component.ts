import { Component } from '@angular/core';
import { focusShadow } from '../../../../shared/animations/focus';
import { TypedItemSearchResultGridElementComponent } from '../../../../shared/object-grid/item-grid-element/item-types/typed-item-search-result-grid-element.component';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';

@listableObjectComponent('JournalVolume', ViewMode.GridElement)
@Component({
  selector: 'ds-journal-volume-grid-element',
  styleUrls: ['./journal-volume-grid-element.component.scss'],
  templateUrl: './journal-volume-grid-element.component.html',
  animations: [focusShadow]
})
/**
 * The component for displaying a grid element for an item of the type Journal Volume
 */
export class JournalVolumeGridElementComponent extends TypedItemSearchResultGridElementComponent {
}
