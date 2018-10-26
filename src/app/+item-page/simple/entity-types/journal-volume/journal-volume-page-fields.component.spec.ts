import { Observable } from 'rxjs/Observable';
import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { JournalVolumePageFieldsComponent } from './journal-volume-page-fields.component';
import { getEntityPageFieldsTest } from '../shared/entity-page-fields.component.spec';

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: Observable.of(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []))),
  metadata: [
    {
      key: 'journalvolume.identifier.volume',
      language: 'en_US',
      value: '1234'
    },
    {
      key: 'journalvolume.issuedate',
      language: 'en_US',
      value: '2018'
    },
    {
      key: 'journalvolume.identifier.description',
      language: 'en_US',
      value: 'desc'
    }]
});

describe('JournalVolumePageFieldsComponent', getEntityPageFieldsTest(mockItem, JournalVolumePageFieldsComponent));
