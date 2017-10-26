import { Component, Inject } from '@angular/core';

import { Collection } from '../../core/shared/collection.model';
import { ObjectGridElementComponent } from '../object-grid-element/object-grid-element.component';
import { gridElementFor } from '../grid-element-decorator';

@Component({
  selector: 'ds-collection-grid-element',
  styleUrls: ['./collection-grid-element.component.scss'],
  templateUrl: './collection-grid-element.component.html'
})

@gridElementFor(Collection)
export class CollectionGridElementComponent extends ObjectGridElementComponent<Collection> {}
