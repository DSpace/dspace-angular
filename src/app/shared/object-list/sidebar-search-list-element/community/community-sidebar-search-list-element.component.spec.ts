import { Community } from '../../../../core/shared/community.model';
import { CommunitySearchResult } from '../../../object-collection/shared/community-search-result.model';
import {
  createSidebarSearchListElementTests,
  getExpectedHierarchicalTitle,
} from '../sidebar-search-list-element.component.spec';
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

const expectedHierarchicalTitle = getExpectedHierarchicalTitle(parent, object);
if (expectedHierarchicalTitle) {
  expectedHierarchicalTitle.subscribe((hierarchicalTitle: string) => {
    describe('CommunitySidebarSearchListElementComponent', () => {
      createSidebarSearchListElementTests(CommunitySidebarSearchListElementComponent, object, parent, hierarchicalTitle, 'title', 'description');
    });
  });
}
