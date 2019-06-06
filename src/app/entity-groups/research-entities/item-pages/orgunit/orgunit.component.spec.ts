import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { OrgunitComponent } from './orgunit.component';
import { of as observableOf } from 'rxjs';
import {
  createRelationshipsObservable,
  getItemPageFieldsTest
} from '../../../../+item-page/simple/item-types/shared/item.component.spec';

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: observableOf(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []))),
  metadata: {
    'orgunit.identifier.dateestablished': [
      {
        language: 'en_US',
        value: '2018'
      }
    ],
    'orgunit.identifier.city': [
      {
        language: 'en_US',
        value: 'New York'
      }
    ],
    'orgunit.identifier.country': [
      {
        language: 'en_US',
        value: 'USA'
      }
    ],
    'orgunit.identifier.id': [
      {
        language: 'en_US',
        value: '1'
      }
    ],
    'orgunit.identifier.description': [
      {
        language: 'en_US',
        value: 'desc'
      }
    ]
  },
  relationships: createRelationshipsObservable()
});

describe('OrgUnitComponent', getItemPageFieldsTest(mockItem, OrgunitComponent));
