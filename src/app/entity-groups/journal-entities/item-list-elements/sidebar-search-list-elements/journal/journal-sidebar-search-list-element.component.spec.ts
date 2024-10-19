import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';
import { followLink } from 'src/app/shared/utils/follow-link-config.model';

import { Collection } from '../../../../../core/shared/collection.model';
import { Item } from '../../../../../core/shared/item.model';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { createSidebarSearchListElementTests } from '../../../../../shared/object-list/sidebar-search-list-element/sidebar-search-list-element.component.spec';
import { JournalSidebarSearchListElementComponent } from './journal-sidebar-search-list-element.component';

const object = Object.assign(new ItemSearchResult(), {
  indexableObject: Object.assign(new Item(), {
    id: 'test-item',
    metadata: {
      'dc.title': [
        {
          value: 'title',
        },
      ],
      'creativeworkseries.issn': [
        {
          value: '1234',
        },
        {
          value: '5678',
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

function getExpectedHierarchicalTitle(parentObj: DSpaceObject, obj: ItemSearchResult): string {
  let titles: string[] = [obj.indexableObject.metadata['dc.title'][0].value];
  let currentParent: DSpaceObject = parentObj;

  while (currentParent) {
    titles.unshift(currentParent.metadata['dc.title'][0].value);
    currentParent = this.getParent();
  }

  return titles.join(' > ');
}

function getParent(): DSpaceObject {
  if (this.dso && typeof this.dso.getParentLinkKey === 'function') {
    const parentLinkKey = this.dso.getParentLinkKey();
    const parentObj = this.linkService.resolveLink(this.dso, followLink(parentLinkKey))[parentLinkKey];
    if (parentObj && parentObj.payload) {
      return parentObj.payload;
    }
  }
  return undefined;
}
const expectedHierarchicalTitle = getExpectedHierarchicalTitle(parent, object);

describe('JournalSidebarSearchListElementComponent',
  createSidebarSearchListElementTests(JournalSidebarSearchListElementComponent, object, parent, expectedHierarchicalTitle, 'title', '1234, 5678'),
);
