import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { ProjectComponent } from './project.component';
import { of as observableOf } from 'rxjs';
import {
  createRelationshipsObservable,
  getItemPageFieldsTest
} from '../../../../+item-page/simple/item-types/shared/item.component.spec';

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: observableOf(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []))),
  metadata: {
    // 'project.identifier.status': [
    //   {
    //     language: 'en_US',
    //     value: 'published'
    //   }
    // ],
    'dc.identifier': [
      {
        language: 'en_US',
        value: '1'
      }
    ],
    // 'project.identifier.expectedcompletion': [
    //   {
    //     language: 'en_US',
    //     value: 'exp comp'
    //   }
    // ],
    'dc.description': [
      {
        language: 'en_US',
        value: 'keyword'
      }
    ],
    'dc.subject': [
      {
        language: 'en_US',
        value: 'keyword'
      }
    ]
  },
  relationships: createRelationshipsObservable()
});

describe('ProjectComponent', getItemPageFieldsTest(mockItem, ProjectComponent));
