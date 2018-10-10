import { Component, Input, Inject } from '@angular/core';

import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { renderElementsFor } from '../../object-collection/shared/dso-element-decorator';
import { BrowseEntry } from '../../../core/shared/browse-entry.model';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { SetViewMode } from '../../view-mode';

@Component({
  selector: 'ds-browse-entry-list-element',
  styleUrls: ['./browse-entry-list-element.component.scss'],
  templateUrl: './browse-entry-list-element.component.html'
})

/**
 * This component is automatically used to create a list view for BrowseEntry objects when used in ObjectCollectionComponent
 */
@renderElementsFor(BrowseEntry, SetViewMode.List)
export class BrowseEntryListElementComponent extends AbstractListableElementComponent<BrowseEntry> {}
