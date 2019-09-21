import { ItemSearchResult } from '../../../../shared/object-collection/shared/item-search-result.model';
import { Item } from '../../../../core/shared/item.model';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { getEntityGridElementTestComponent } from '../../../../shared/object-grid/item-grid-element/item-types/publication/publication-grid-element.component.spec';
import { JournalIssueGridElementComponent } from './journal-issue-grid-element.component';
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
    'creativework.datePublished': [
      {
        language: null,
        value: '2015-06-26'
      }
    ],
    'journal.title': [
      {
        language: 'en_US',
        value: 'The journal title'
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

describe('JournalIssueGridElementComponent', getEntityGridElementTestComponent(JournalIssueGridElementComponent, mockItemWithMetadata, mockItemWithoutMetadata, ['date', 'journal-title']));
