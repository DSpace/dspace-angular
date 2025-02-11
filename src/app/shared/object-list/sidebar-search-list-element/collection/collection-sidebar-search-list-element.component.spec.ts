import {
  catchError,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { RemoteData } from 'src/app/core/data/remote-data';

import { Collection } from '../../../../core/shared/collection.model';
import { Community } from '../../../../core/shared/community.model';
import { CollectionSearchResult } from '../../../object-collection/shared/collection-search-result.model';
import { createSidebarSearchListElementTests } from '../sidebar-search-list-element.component.spec';
import { CollectionSidebarSearchListElementComponent } from './collection-sidebar-search-list-element.component';

const object = Object.assign(new CollectionSearchResult(), {
  indexableObject: Object.assign(new Collection(), {
    id: 'test-collection',
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
  id: 'test-community',
  metadata: {
    'dc.title': [
      {
        value: 'parent title',
      },
    ],
  },
});

function getExpectedHierarchicalTitle(parentObj: Community, obj: CollectionSearchResult): Observable<string> {
  let titles: string[] = [];
  if (obj.indexableObject.metadata['dc.title']) {
    titles = [obj.indexableObject.metadata['dc.title'][0].value];
  }
  let currentParent: Community = parentObj;

  const fetchParentTitles = (currParent: Collection | Community): Observable<string[]> => {
    if (!currParent) {
      return of([]);
    }

    if (currParent.parentCommunity) {
      return currParent.parentCommunity.pipe(
        switchMap((remoteData: RemoteData<Community>) => {
          if (remoteData.hasSucceeded && remoteData.payload) {
            const parentTitle = remoteData.payload.name;
            titles.unshift(parentTitle);
            return fetchParentTitles(remoteData.payload);
          }
          return of([]);
        }),
        catchError(() => of([])),
      );
    } else {
      return of([]);
    }
  };

  return fetchParentTitles(currentParent).pipe(
    switchMap(() => titles.join(' > ')),
  );
}

const expectedHierarchicalTitle = getExpectedHierarchicalTitle(parent, object);
if (expectedHierarchicalTitle) {
  expectedHierarchicalTitle.subscribe((hierarchicalTitle: string) => {
    describe('CollectionSidebarSearchListElementComponent', () => {
      createSidebarSearchListElementTests(CollectionSidebarSearchListElementComponent, object, parent, hierarchicalTitle, 'title', 'description');
    });
  });
}
