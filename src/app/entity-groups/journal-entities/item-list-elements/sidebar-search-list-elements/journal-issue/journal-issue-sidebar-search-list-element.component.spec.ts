import { Collection } from '../../../../../core/shared/collection.model';
import { Item } from '../../../../../core/shared/item.model';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import {
  createSidebarSearchListElementTests,
  getExpectedHierarchicalTitle,
} from '../../../../../shared/object-list/sidebar-search-list-element/sidebar-search-list-element.component.spec';
import { JournalIssueSidebarSearchListElementComponent } from './journal-issue-sidebar-search-list-element.component';

const object = Object.assign(new ItemSearchResult(), {
  indexableObject: Object.assign(new Item(), {
    id: 'test-item',
    metadata: {
      'dc.title': [
        {
          value: 'title',
        },
      ],
      'publicationvolume.volumeNumber': [
        {
          value: '5',
        },
      ],
      'publicationissue.issueNumber': [
        {
          value: '7',
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

const expectedHierarchicalTitle = getExpectedHierarchicalTitle(parent, object);
if (expectedHierarchicalTitle) {
  expectedHierarchicalTitle.subscribe((hierarchicalTitle: string) => {
    describe('JournalIssueSidebarSearchListElementComponent', () => {
      createSidebarSearchListElementTests(
        JournalIssueSidebarSearchListElementComponent,
        object,
        parent,
        hierarchicalTitle,
        'title',
        '1234, 5678',
      );
    });
  });
}
