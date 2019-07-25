import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { PersonComponent } from './person.component';
import { of as observableOf } from 'rxjs';
import {
  createRelationshipsObservable,
  getItemPageFieldsTest
} from '../../../../+item-page/simple/item-types/shared/item.component.spec';

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: observableOf(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []))),
  metadata: {
    'person.email': [
      {
        language: 'en_US',
        value: 'fake@email.com'
      }
    ],
    // 'person.identifier.orcid': [
    //   {
    //     language: 'en_US',
    //     value: 'ORCID-1'
    //   }
    // ],
    'person.birthDate': [
      {
        language: 'en_US',
        value: '1993'
      }
    ],
    // 'person.identifier.staffid': [
    //   {
    //     language: 'en_US',
    //     value: '1'
    //   }
    // ],
    'person.jobTitle': [
      {
        language: 'en_US',
        value: 'Developer'
      }
    ],
    'person.familyName': [
      {
        language: 'en_US',
        value: 'Doe'
      }
    ],
    'person.givenName': [
      {
        language: 'en_US',
        value: 'John'
      }
    ]
  },
  relationships: createRelationshipsObservable()
});

describe('PersonComponent', getItemPageFieldsTest(mockItem, PersonComponent));
