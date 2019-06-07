import { ItemSearchResult } from '../../../../shared/object-collection/shared/item-search-result.model';
import { Item } from '../../../../core/shared/item.model';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { getEntityGridElementTestComponent } from '../../../../shared/object-grid/item-grid-element/item-types/publication/publication-grid-element.component.spec';
import { OrgunitGridElementComponent } from './orgunit-grid-element.component';

const mockItemWithMetadata: ItemSearchResult = new ItemSearchResult();
mockItemWithMetadata.hitHighlights = {};
mockItemWithMetadata.indexableObject = Object.assign(new Item(), {
  bitstreams: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'orgunit.identifier.dateestablished': [
      {
        language: null,
        value: '2015-06-26'
      }
    ],
    'orgunit.identifier.country': [
      {
        language: 'en_US',
        value: 'Belgium'
      }
    ],
    'orgunit.identifier.city': [
      {
        language: 'en_US',
        value: 'Brussels'
      }
    ]
  }
});

const mockItemWithoutMetadata: ItemSearchResult = new ItemSearchResult();
mockItemWithoutMetadata.hitHighlights = {};
mockItemWithoutMetadata.indexableObject = Object.assign(new Item(), {
  bitstreams: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ]
  }
});

describe('OrgunitGridElementComponent', getEntityGridElementTestComponent(OrgunitGridElementComponent, mockItemWithMetadata, mockItemWithoutMetadata, ['date', 'country', 'city']));
