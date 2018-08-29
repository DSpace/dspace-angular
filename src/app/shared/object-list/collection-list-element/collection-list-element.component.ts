import { Component, Inject } from '@angular/core';

import { Collection } from '../../../core/shared/collection.model';
import { renderElementsFor } from '../../object-collection/shared/dso-element-decorator';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { ViewMode } from '../../../core/shared/view-mode.model';

@Component({
  selector: 'ds-collection-list-element',
  styleUrls: ['./collection-list-element.component.scss'],
  templateUrl: './collection-list-element.component.html'
})

@renderElementsFor(Collection, ViewMode.List)
export class CollectionListElementComponent extends AbstractListableElementComponent<Collection> {}
