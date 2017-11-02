import { Component, Inject } from '@angular/core';

import { Collection } from '../../core/shared/collection.model';
import { ObjectGridElementComponent } from '../object-grid-element/object-grid-element.component';
import { renderElementsFor} from '../../object-collection/shared/dso-element-decorator';
import { ViewMode } from '../../+search-page/search-options.model';


@Component({
  selector: 'ds-collection-grid-element',
  styleUrls: ['./collection-grid-element.component.scss'],
  templateUrl: './collection-grid-element.component.html'
})

@renderElementsFor(Collection, ViewMode.Grid)
export class CollectionGridElementComponent extends ObjectGridElementComponent<Collection> {}
