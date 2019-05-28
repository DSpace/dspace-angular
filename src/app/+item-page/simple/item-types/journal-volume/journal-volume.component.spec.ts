import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { createRelationshipsObservable, getItemPageFieldsTest } from '../shared/item.component.spec';
import { JournalVolumeComponent } from './journal-volume.component';
import { of as observableOf } from 'rxjs';

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: observableOf(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []))),
  metadata: {
    'journalvolume.identifier.volume': [
      {
        language: 'en_US',
        value: '1234'
      }
    ],
    'journalvolume.issuedate': [
      {
        language: 'en_US',
        value: '2018'
      }
    ],
    'journalvolume.identifier.description': [
      {
        language: 'en_US',
        value: 'desc'
      }
    ]
  },
  relationships: createRelationshipsObservable()
});

describe('JournalVolumeComponent', getItemPageFieldsTest(mockItem, JournalVolumeComponent));
