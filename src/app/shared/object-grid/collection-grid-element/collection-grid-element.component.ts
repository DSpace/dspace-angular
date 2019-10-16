import { Component, Inject } from '@angular/core';

import { Collection } from '../../../core/shared/collection.model';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../object-collection/shared/listable-object/listable-object.decorator';

/**
 * Component representing a grid element for collection
 */
@Component({
  selector: 'ds-collection-grid-element',
  styleUrls: ['./collection-grid-element.component.scss'],
  templateUrl: './collection-grid-element.component.html'
})

@listableObjectComponent(Collection, ViewMode.GridElement)
export class CollectionGridElementComponent extends AbstractListableElementComponent<Collection> {}
