import {
  createRelationshipsObservable,
  getItemPageFieldsTest
} from '../../../../item-page/simple/item-types/shared/item.component.spec';
import { buildPaginatedList } from '../../../../core/data/paginated-list.model';
import { Item } from '../../../../core/shared/item.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { PersonComponent } from './person.component';

const mockItem: Item = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
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
