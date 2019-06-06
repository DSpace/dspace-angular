import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { JournalIssueComponent } from './journal-issue.component';
import { of as observableOf } from 'rxjs';
import {
  createRelationshipsObservable,
  getItemPageFieldsTest
} from '../../../../+item-page/simple/item-types/shared/item.component.spec';

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: observableOf(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []))),
  metadata: {
    'journalissue.identifier.number': [
      {
        language: 'en_US',
        value: '1234'
      }
    ],
    'journalissue.issuedate': [
      {
        language: 'en_US',
        value: '2018'
      }
    ],
    'journalissue.identifier.description': [
      {
        language: 'en_US',
        value: 'desc'
      }
    ],
    'journalissue.identifier.keyword': [
      {
        language: 'en_US',
        value: 'keyword'
      }
    ]
  },
  relationships: createRelationshipsObservable()
});

describe('JournalIssueComponent', getItemPageFieldsTest(mockItem, JournalIssueComponent));
