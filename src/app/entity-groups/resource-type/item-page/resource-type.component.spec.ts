import {
  createRelationshipsObservable,
  getItemPageFieldsTest
} from '../../../item-page/simple/item-types/shared/item.component.spec';
import { buildPaginatedList } from '../../../core/data/paginated-list.model';
import { Item } from '../../../core/shared/item.model';
import { PageInfo } from '../../../core/shared/page-info.model';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { ResourceTypeComponent } from './resource-type.component';

const mockItem: Item = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
  metadata: {
    'resourcetypes.preferredLabels': [
      {
        language: 'en',
        value: 'doctoral thesis'
      },
      {
        language: 'es',
        value: 'tesis doctoral'
      },
      {
        language: 'fr',
        value: 'thèse de doctorat'
      },
      {
        language: 'de',
        value: 'Dissertation'
      },
      {
        language: 'it',
        value: 'tesi di dottorato'
      },
    ],
  },
  relationships: createRelationshipsObservable()
});

describe('ResourceTypeComponent', getItemPageFieldsTest(mockItem, ResourceTypeComponent));
