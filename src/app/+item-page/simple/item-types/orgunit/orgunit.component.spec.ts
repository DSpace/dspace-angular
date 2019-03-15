import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { createRelationshipsObservable, getItemPageFieldsTest } from '../shared/item.component.spec';
import { OrgunitComponent } from './orgunit.component';
import { of as observableOf } from 'rxjs';

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: observableOf(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []))),
  metadata: [
    {
      key: 'orgunit.identifier.dateestablished',
      language: 'en_US',
      value: '2018'
    },
    {
      key: 'orgunit.identifier.city',
      language: 'en_US',
      value: 'New York'
    },
    {
      key: 'orgunit.identifier.country',
      language: 'en_US',
      value: 'USA'
    },
    {
      key: 'orgunit.identifier.id',
      language: 'en_US',
      value: '1'
    },
    {
      key: 'orgunit.identifier.description',
      language: 'en_US',
      value: 'desc'
    }],
  relationships: createRelationshipsObservable()
});

describe('OrgUnitComponent', getItemPageFieldsTest(mockItem, OrgunitComponent));
