import { ItemSearchResult } from '../../../../../../../modules/core/src/lib/core/object-collection/item-search-result.model';
import { Collection } from '../../../../../../../modules/core/src/lib/core/shared/collection.model';
import { Item } from '../../../../../../../modules/core/src/lib/core/shared/item.model';
import { createSidebarSearchListElementTests } from '../../../../../shared/object-list/sidebar-search-list-element/sidebar-search-list-element.component.spec';
import { ProjectSidebarSearchListElementComponent } from './project-sidebar-search-list-element.component';

const object = Object.assign(new ItemSearchResult(), {
  indexableObject: Object.assign(new Item(), {
    id: 'test-item',
    metadata: {
      'dc.title': [
        {
          value: 'title',
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

describe('ProjectSidebarSearchListElementComponent',
  createSidebarSearchListElementTests(ProjectSidebarSearchListElementComponent, object, parent, 'parent title', 'title', undefined),
);
