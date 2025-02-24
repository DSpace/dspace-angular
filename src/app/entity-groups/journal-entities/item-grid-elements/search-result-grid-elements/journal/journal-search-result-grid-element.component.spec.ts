import {
  buildPaginatedList,
  createSuccessfulRemoteDataObject$,
  Item,
  ItemSearchResult,
  PageInfo,
} from '@dspace/core';

import { getEntityGridElementTestComponent } from '../../../../../shared/object-grid/search-result-grid-element/item-search-result/item/item-search-result-grid-element.component.spec';
import { JournalSearchResultGridElementComponent } from './journal-search-result-grid-element.component';

const mockItemWithMetadata: ItemSearchResult = new ItemSearchResult();
mockItemWithMetadata.hitHighlights = {};
mockItemWithMetadata.indexableObject = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title',
      },
    ],
    'creativework.editor': [
      {
        language: 'en_US',
        value: 'Smith, Donald',
      },
    ],
    'creativework.publisher': [
      {
        language: 'en_US',
        value: 'A company',
      },
    ],
    'dc.description': [
      {
        language: 'en_US',
        value: 'This is the description',
      },
    ],
  },
});

const mockItemWithoutMetadata: ItemSearchResult = new ItemSearchResult();
mockItemWithoutMetadata.hitHighlights = {};
mockItemWithoutMetadata.indexableObject = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title',
      },
    ],
  },
});

describe('JournalSearchResultGridElementComponent', getEntityGridElementTestComponent(JournalSearchResultGridElementComponent, mockItemWithMetadata, mockItemWithoutMetadata, ['editor', 'publisher', 'description']));
