import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { Item } from '../../../../../core/shared/item.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../../shared/remote-data.utils';
import { PaginatedList } from '../../../../../core/data/paginated-list';
import { PageInfo } from '../../../../../core/shared/page-info.model';
import { getEntityGridElementTestComponent } from '../../../../../shared/object-grid/search-result-grid-element/item-search-result/publication/publication-search-result-grid-element.component.spec';
import { JournalIssueSearchResultGridElementComponent } from './journal-issue-search-result-grid-element.component';

const mockItemWithMetadata: ItemSearchResult = new ItemSearchResult();
mockItemWithMetadata.hitHighlights = {};
mockItemWithMetadata.indexableObject = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [])),
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
  bundles: createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [])),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ]
  }
});

describe('JournalIssueSearchResultGridElementComponent', getEntityGridElementTestComponent(JournalIssueSearchResultGridElementComponent, mockItemWithMetadata, mockItemWithoutMetadata, ['date', 'journal-title']));
