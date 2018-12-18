import { Observable } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { createRelationshipsObservable, getEntityPageFieldsTest } from '../shared/entity.component.spec';
import { ProjectComponent } from './project.component';
import { of as observableOf } from 'rxjs';

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: observableOf(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []))),
  metadata: [
    {
      key: 'project.identifier.status',
      language: 'en_US',
      value: 'published'
    },
    {
      key: 'project.identifier.id',
      language: 'en_US',
      value: '1'
    },
    {
      key: 'project.identifier.expectedcompletion',
      language: 'en_US',
      value: 'exp comp'
    },
    {
      key: 'project.identifier.description',
      language: 'en_US',
      value: 'keyword'
    },
    {
      key: 'project.identifier.keyword',
      language: 'en_US',
      value: 'keyword'
    }],
  relationships: createRelationshipsObservable()
});

describe('ProjectComponent', getEntityPageFieldsTest(mockItem, ProjectComponent));
