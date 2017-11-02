import { Component, Inject } from '@angular/core';

import { Collection } from '../../core/shared/collection.model';
import { ObjectListElementComponent } from '../object-list-element/object-list-element.component';
import { renderElementsFor } from '../../object-collection/shared/dso-element-decorator';
import { ViewMode } from '../../+search-page/search-options.model';

@Component({
  selector: 'ds-collection-list-element',
  styleUrls: ['./collection-list-element.component.scss'],
  templateUrl: './collection-list-element.component.html'
})

@renderElementsFor(Collection, ViewMode.List)
export class CollectionListElementComponent extends ObjectListElementComponent<Collection> {}
