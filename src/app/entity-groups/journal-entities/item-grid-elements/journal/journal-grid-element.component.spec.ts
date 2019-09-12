import { ItemSearchResult } from '../../../../shared/object-collection/shared/item-search-result.model';
import { Item } from '../../../../core/shared/item.model';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { getEntityGridElementTestComponent } from '../../../../shared/object-grid/item-grid-element/item-types/publication/publication-grid-element.component.spec';
import { JournalGridElementComponent } from './journal-grid-element.component';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/testing/utils';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';

const mockItemWithMetadata: ItemSearchResult = new ItemSearchResult();
mockItemWithMetadata.hitHighlights = {};
mockItemWithMetadata.indexableObject = Object.assign(new Item(), {
  bitstreams: createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [])),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'creativework.editor': [
      {
        language: 'en_US',
        value: 'Smith, Donald'
      }
    ],
    'creativework.publisher': [
      {
        language: 'en_US',
        value: 'A company'
      }
    ],
    'dc.description': [
      {
        language: 'en_US',
        value: 'This is the description'
      }
    ]
  }
});

const mockItemWithoutMetadata: ItemSearchResult = new ItemSearchResult();
mockItemWithoutMetadata.hitHighlights = {};
mockItemWithoutMetadata.indexableObject = Object.assign(new Item(), {
  bitstreams: createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [])),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ]
  }
});

describe('JournalGridElementComponent', getEntityGridElementTestComponent(JournalGridElementComponent, mockItemWithMetadata, mockItemWithoutMetadata, ['editor', 'publisher', 'description']));
