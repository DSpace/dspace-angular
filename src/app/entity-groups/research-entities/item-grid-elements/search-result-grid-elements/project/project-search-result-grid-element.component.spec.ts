import { buildPaginatedList } from '../../../../../../../modules/core/src/lib/core/data/paginated-list.model';
import { ItemSearchResult } from '../../../../../../../modules/core/src/lib/core/object-collection/item-search-result.model';
import { Item } from '../../../../../../../modules/core/src/lib/core/shared/item.model';
import { PageInfo } from '../../../../../../../modules/core/src/lib/core/shared/page-info.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../../../../modules/core/src/lib/core/utilities/remote-data.utils';
import { getEntityGridElementTestComponent } from '../../../../../shared/object-grid/search-result-grid-element/item-search-result/item/item-search-result-grid-element.component.spec';
import { ProjectSearchResultGridElementComponent } from './project-search-result-grid-element.component';

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
    'dc.description': [
      {
        language: 'en_US',
        value: 'The project description',
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

describe('ProjectSearchResultGridElementComponent', getEntityGridElementTestComponent(ProjectSearchResultGridElementComponent, mockItemWithMetadata, mockItemWithoutMetadata, ['description']));
