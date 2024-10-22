import {
  catchError,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { RemoteData } from 'src/app/core/data/remote-data';
import { Community } from 'src/app/core/shared/community.model';

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

function getExpectedHierarchicalTitle(parentObj: Collection, obj: ItemSearchResult): Observable<string> {
  let titles: string[] = [];
  if (obj.indexableObject.metadata['dc.title']) {
    titles = [obj.indexableObject.metadata['dc.title'][0].value];
  }
  let currentParent: Collection = parentObj;

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
            if (remoteData.payload) {
              return fetchParentTitles(remoteData.payload);
            }
          }
          return of([]);
        }),
        catchError(() => of([])),
        map(() => titles),
      );
    }
  };

  if (fetchParentTitles(currentParent)) {
    return fetchParentTitles(currentParent).pipe(
      map(() => titles.join(' > ')),
    );
  }
}

const expectedHierarchicalTitle = getExpectedHierarchicalTitle(parent, object);
if (expectedHierarchicalTitle) {
  expectedHierarchicalTitle.subscribe((hierarchicalTitle: string) => {
    describe('JournalSidebarSearchListElementComponent', () => {
      createSidebarSearchListElementTests(JournalSidebarSearchListElementComponent, object, parent, hierarchicalTitle, 'title', '1234, 5678');
    });
  });
}
