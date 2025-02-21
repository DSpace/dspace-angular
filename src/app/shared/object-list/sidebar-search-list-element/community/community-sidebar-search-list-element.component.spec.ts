import { CommunitySearchResult } from '@dspace/core';
import { Community } from '@dspace/core';
import { createSidebarSearchListElementTests } from '../sidebar-search-list-element.component.spec';
import { CommunitySidebarSearchListElementComponent } from './community-sidebar-search-list-element.component';

const object = Object.assign(new CommunitySearchResult(), {
  indexableObject: Object.assign(new Community(), {
    id: 'test-community',
    metadata: {
      'dc.title': [
        {
          value: 'title',
        },
      ],
      'dc.description.abstract': [
        {
          value: 'description',
        },
      ],
    },
  }),
});
const parent = Object.assign(new Community(), {
  id: 'test-parent-community',
  metadata: {
    'dc.title': [
      {
        value: 'parent title',
      },
    ],
  },
});

describe('CommunitySidebarSearchListElementComponent',
  createSidebarSearchListElementTests(CommunitySidebarSearchListElementComponent, object, parent, 'parent title', 'title', 'description'),
);
