import { buildPaginatedList } from '../../../../../../modules/core/src/lib/core/data/paginated-list.model';
import { Item } from '../../../../../../modules/core/src/lib/core/shared/item.model';
import { PageInfo } from '../../../../../../modules/core/src/lib/core/shared/page-info.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../../../modules/core/src/lib/core/utilities/remote-data.utils';
import {
  createRelationshipsObservable,
  getItemPageFieldsTest,
} from '../../../../item-page/simple/item-types/shared/item.component.spec';
import { OrgUnitComponent } from './org-unit.component';

const mockItem: Item = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
  metadata: {
    'organization.foundingDate': [
      {
        language: 'en_US',
        value: '2018',
      },
    ],
    'organization.address.addressLocality': [
      {
        language: 'en_US',
        value: 'New York',
      },
    ],
    'organization.address.addressCountry': [
      {
        language: 'en_US',
        value: 'USA',
      },
    ],
    'dc.identifier': [
      {
        language: 'en_US',
        value: '1',
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

describe('OrgUnitComponent', getItemPageFieldsTest(mockItem, OrgUnitComponent));
