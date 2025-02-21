import { buildPaginatedList } from '../../../../../../modules/core/src/lib/core/data/paginated-list.model';
import { Item } from '../../../../../../modules/core/src/lib/core/shared/item.model';
import { PageInfo } from '../../../../../../modules/core/src/lib/core/shared/page-info.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../../../modules/core/src/lib/core/utilities/remote-data.utils';
import {
  createRelationshipsObservable,
  getItemPageFieldsTest,
} from '../../../../item-page/simple/item-types/shared/item.component.spec';
import { JournalIssueComponent } from './journal-issue.component';

const mockItem: Item = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
  metadata: {
    'publicationissue.issueNumber': [
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
    'creativework.keywords': [
      {
        language: 'en_US',
        value: 'keyword',
      },
    ],
  },
  relationships: createRelationshipsObservable(),
});

describe('JournalIssueComponent', getItemPageFieldsTest(mockItem, JournalIssueComponent));
