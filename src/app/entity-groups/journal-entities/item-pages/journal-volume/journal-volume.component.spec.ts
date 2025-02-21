import { buildPaginatedList } from '@dspace/core';
import { Item } from '@dspace/core';
import { PageInfo } from '@dspace/core';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core';
import {
  createRelationshipsObservable,
  getItemPageFieldsTest,
} from '../../../../item-page/simple/item-types/shared/item.component.spec';
import { JournalVolumeComponent } from './journal-volume.component';

const mockItem: Item = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
  metadata: {
    'publicationvolume.volumeNumber': [
      {
        language: 'en_US',
        value: '1234',
      },
    ],
    'creativework.datePublished': [
      {
        language: 'en_US',
        value: '2018',
      },
    ],
    'dc.description': [
      {
        language: 'en_US',
        value: 'desc',
      },
    ],
  },
  relationships: createRelationshipsObservable(),
});

describe('JournalVolumeComponent', getItemPageFieldsTest(mockItem, JournalVolumeComponent));
