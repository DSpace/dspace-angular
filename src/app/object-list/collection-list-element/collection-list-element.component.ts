import { Component, Inject } from '@angular/core';

import { Collection } from '../../core/shared/collection.model';
import { ObjectListElementComponent } from '../object-list-element/object-list-element.component';
import { listElementFor } from '../list-element-decorator';

@Component({
  selector: 'ds-collection-list-element',
  styleUrls: ['./collection-list-element.component.scss'],
  templateUrl: './collection-list-element.component.html'
})

@listElementFor(Collection)
export class CollectionListElementComponent extends ObjectListElementComponent<Collection> {}
