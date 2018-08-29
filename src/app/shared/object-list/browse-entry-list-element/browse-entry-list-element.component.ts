import { Component, Input, Inject } from '@angular/core';

import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { renderElementsFor } from '../../object-collection/shared/dso-element-decorator';
import { ViewMode } from '../../../+search-page/search-options.model';
import { BrowseEntry } from '../../../core/shared/browse-entry.model';

@Component({
  selector: 'ds-browse-entry-list-element',
  styleUrls: ['./browse-entry-list-element.component.scss'],
  templateUrl: './browse-entry-list-element.component.html'
})

/**
 * This component is automatically used to create a list view for BrowseEntry objects when used in ObjectCollectionComponent
 */
@renderElementsFor(BrowseEntry, ViewMode.List)
export class BrowseEntryListElementComponent extends AbstractListableElementComponent<BrowseEntry> {}
