import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';
import { followLink } from 'src/app/shared/utils/follow-link-config.model';

import { Community } from '../../../../core/shared/community.model';
import { CommunitySearchResult } from '../../../object-collection/shared/community-search-result.model';
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

function getExpectedHierarchicalTitle(parentObj: DSpaceObject, obj: CommunitySearchResult): string {
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

describe('CommunitySidebarSearchListElementComponent',
  createSidebarSearchListElementTests(CommunitySidebarSearchListElementComponent, object, parent, expectedHierarchicalTitle, 'title', 'description'),
);
