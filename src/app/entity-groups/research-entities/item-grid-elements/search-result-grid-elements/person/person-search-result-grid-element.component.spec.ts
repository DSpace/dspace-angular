import { buildPaginatedList } from '@dspace/core';
import { ItemSearchResult } from '@dspace/core';
import { Item } from '@dspace/core';
import { PageInfo } from '@dspace/core';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core';
import { getEntityGridElementTestComponent } from '../../../../../shared/object-grid/search-result-grid-element/item-search-result/item/item-search-result-grid-element.component.spec';
import { PersonSearchResultGridElementComponent } from './person-search-result-grid-element.component';

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
    'person.email': [
      {
        language: 'en_US',
        value: 'Smith-Donald@gmail.com',
      },
    ],
    'person.jobTitle': [
      {
        language: 'en_US',
        value: 'Web Developer',
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

describe('PersonSearchResultGridElementComponent', getEntityGridElementTestComponent(PersonSearchResultGridElementComponent, mockItemWithMetadata, mockItemWithoutMetadata, ['email', 'jobtitle']));
