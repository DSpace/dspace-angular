import { Component } from '@angular/core';

import { Item } from '../../../../core/shared/item.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { AbstractListableElementComponent } from '../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';
import { JournalVolumeSearchResultListElementComponent } from '../search-result-list-elements/journal-volume/journal-volume-search-result-list-element.component';

@listableObjectComponent('JournalVolume', ViewMode.ListElement)
@Component({
  selector: 'ds-journal-volume-list-element',
  styleUrls: ['./journal-volume-list-element.component.scss'],
  templateUrl: './journal-volume-list-element.component.html',
  standalone: true,
  imports: [
    JournalVolumeSearchResultListElementComponent,
  ],
})
/**
 * The component for displaying a list element for an item of the type Journal Volume
 */
export class JournalVolumeListElementComponent extends AbstractListableElementComponent<Item> {
}
