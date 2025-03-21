import { Component } from '@angular/core';

import { Item } from '../../../../core/shared/item.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { AbstractListableElementComponent } from '../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';
import { JournalVolumeSearchResultGridElementComponent } from '../search-result-grid-elements/journal-volume/journal-volume-search-result-grid-element.component';

@listableObjectComponent('JournalVolume', ViewMode.GridElement)
@Component({
  selector: 'ds-journal-volume-grid-element',
  styleUrls: ['./journal-volume-grid-element.component.scss'],
  templateUrl: './journal-volume-grid-element.component.html',
  standalone: true,
  imports: [JournalVolumeSearchResultGridElementComponent],
})
/**
 * The component for displaying a grid element for an item of the type Journal Volume
 */
export class JournalVolumeGridElementComponent extends AbstractListableElementComponent<Item> {
}
