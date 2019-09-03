import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { JournalVolumeComponent } from './journal-volume.component';
import { of as observableOf } from 'rxjs';
import {
  createRelationshipsObservable,
  getItemPageFieldsTest
} from '../../../../+item-page/simple/item-types/shared/item.component.spec';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/testing/utils';

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [])),
  metadata: {
    'publicationvolume.volumeNumber': [
      {
        language: 'en_US',
        value: '1234'
      }
    ],
    'creativework.datePublished': [
      {
        language: 'en_US',
        value: '2018'
      }
    ],
    'dc.description': [
      {
        language: 'en_US',
        value: 'desc'
      }
    ]
  },
  relationships: createRelationshipsObservable()
});

describe('JournalVolumeComponent', getItemPageFieldsTest(mockItem, JournalVolumeComponent));
