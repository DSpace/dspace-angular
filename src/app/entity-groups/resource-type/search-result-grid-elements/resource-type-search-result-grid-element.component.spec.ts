import { ItemSearchResult } from '../../../shared/object-collection/shared/item-search-result.model';
import { Item } from '../../../core/shared/item.model';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { buildPaginatedList } from '../../../core/data/paginated-list.model';
import { PageInfo } from '../../../core/shared/page-info.model';
import { ResourceTypeSearchResultGridElementComponent } from './resource-type-search-result-grid-element.component';
import { getEntityGridElementTestComponent } from '../../../shared/object-grid/search-result-grid-element/item-search-result/item/item-search-result-grid-element.component.spec';

const mockItemWithMetadata: ItemSearchResult = new ItemSearchResult();
mockItemWithMetadata.hitHighlights = {};
mockItemWithMetadata.indexableObject = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
  metadata: {
    'resourcetypes.name': [
      {
        language: null,
        value: 'doctoral thesis'
      }
    ],
    'resourcetypes.definition': [
      {
        language: null,
        value: 'A thesis reporting the research undertaken during a period of graduate study leading to a doctoral degree.'
      }
    ],
    'resourcetypes.preferredLabels': [
      {
        language: 'en',
        value: 'doctoral thesis'
      },
      {
        language: 'es',
        value: 'tesis doctoral'
      },
      {
        language: 'fr',
        value: 'thèse de doctorat'
      },
      {
        language: 'de',
        value: 'Dissertation'
      },
      {
        language: 'it',
        value: 'tesi di dottorato'
      },
    ],
    'resourcetypes.relatedTerms': [
      {
        language: null,
        value: 'Broad Match: http://purl.org/eprint/type/Thesis'
      }
    ],
    'resourcetypes.uri': [
      {
        language: null,
        value: 'http://purl.org/coar/resource_type/c_db06'
      }
    ]
  }
});

const mockItemWithoutMetadata: ItemSearchResult = new ItemSearchResult();
mockItemWithoutMetadata.hitHighlights = {};
mockItemWithoutMetadata.indexableObject = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
  metadata: {
    'resourcetypes.name': [
      {
        language: null,
        value: 'doctoral thesis'
      }
    ],
  }
});

describe('ResourceTypeSearchResultGridElementComponent', getEntityGridElementTestComponent(ResourceTypeSearchResultGridElementComponent, mockItemWithMetadata, mockItemWithoutMetadata, ['definition']));
