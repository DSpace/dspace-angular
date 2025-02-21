import { ItemSearchResult } from '../../../../../../../modules/core/src/lib/core/object-collection/item-search-result.model';
import { Collection } from '../../../../../../../modules/core/src/lib/core/shared/collection.model';
import { Item } from '../../../../../../../modules/core/src/lib/core/shared/item.model';
import { createSidebarSearchListElementTests } from '../../../../../shared/object-list/sidebar-search-list-element/sidebar-search-list-element.component.spec';
import { OrgUnitSidebarSearchListElementComponent } from './org-unit-sidebar-search-list-element.component';

const object = Object.assign(new ItemSearchResult(), {
  indexableObject: Object.assign(new Item(), {
    id: 'test-item',
    metadata: {
      'dspace.entity.type': [
        {
          value: 'OrgUnit',
        },
      ],
      'organization.legalName': [
        {
          value: 'title',
        },
      ],
      'dc.description': [
        {
          value: 'description',
        },
      ],
    },
  }),
});
const parent = Object.assign(new Collection(), {
  id: 'test-collection',
  metadata: {
    'dc.title': [
      {
        value: 'parent title',
      },
    ],
  },
});

describe('OrgUnitSidebarSearchListElementComponent',
  createSidebarSearchListElementTests(OrgUnitSidebarSearchListElementComponent, object, parent, 'parent title', 'title', 'description'),
);
