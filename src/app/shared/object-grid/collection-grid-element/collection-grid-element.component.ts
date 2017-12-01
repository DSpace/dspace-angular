import { Component, Inject } from '@angular/core';

import { Collection } from '../../../core/shared/collection.model';
import { renderElementsFor} from '../../object-collection/shared/dso-element-decorator';
import { ViewMode } from '../../../+search-page/search-options.model';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';

@Component({
  selector: 'ds-collection-grid-element',
  styleUrls: ['./collection-grid-element.component.scss'],
  templateUrl: './collection-grid-element.component.html'
})

@renderElementsFor(Collection, ViewMode.Grid)
export class CollectionGridElementComponent extends AbstractListableElementComponent<Collection> {}
