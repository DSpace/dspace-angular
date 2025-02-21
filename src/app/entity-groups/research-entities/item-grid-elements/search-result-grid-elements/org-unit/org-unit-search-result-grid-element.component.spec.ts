import { buildPaginatedList } from '../../../../../../../modules/core/src/lib/core/data/paginated-list.model';
import { ItemSearchResult } from '../../../../../../../modules/core/src/lib/core/object-collection/item-search-result.model';
import { Item } from '../../../../../../../modules/core/src/lib/core/shared/item.model';
import { PageInfo } from '../../../../../../../modules/core/src/lib/core/shared/page-info.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../../../../modules/core/src/lib/core/utilities/remote-data.utils';
import { getEntityGridElementTestComponent } from '../../../../../shared/object-grid/search-result-grid-element/item-search-result/item/item-search-result-grid-element.component.spec';
import { OrgUnitSearchResultGridElementComponent } from './org-unit-search-result-grid-element.component';

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
    'organization.foundingDate': [
      {
        language: null,
        value: '2015-06-26',
      },
    ],
    'organization.address.addressCountry': [
      {
        language: 'en_US',
        value: 'Belgium',
      },
    ],
    'organization.address.addressLocality': [
      {
        language: 'en_US',
        value: 'Brussels',
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

describe('OrgUnitSearchResultGridElementComponent', getEntityGridElementTestComponent(OrgUnitSearchResultGridElementComponent, mockItemWithMetadata, mockItemWithoutMetadata, ['date', 'country', 'city']));
