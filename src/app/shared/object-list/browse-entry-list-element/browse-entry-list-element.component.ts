import { Component } from '@angular/core';

import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { BrowseEntry } from '../../../core/shared/browse-entry.model';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../object-collection/shared/listable-object/listable-object.decorator';

@Component({
  selector: 'ds-browse-entry-list-element',
  styleUrls: ['./browse-entry-list-element.component.scss'],
  templateUrl: './browse-entry-list-element.component.html'
})

/**
 * This component is automatically used to create a list view for BrowseEntry objects when used in ObjectCollectionComponent
 */
@listableObjectComponent(BrowseEntry, ViewMode.ListElement)
export class BrowseEntryListElementComponent extends AbstractListableElementComponent<BrowseEntry> {}
