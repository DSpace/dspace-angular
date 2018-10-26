import { Observable } from 'rxjs/Observable';
import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { ProjectPageFieldsComponent } from './project-page-fields.component';
import { createRelationshipsObservable, getEntityPageFieldsTest } from '../shared/entity-page-fields.component.spec';

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: Observable.of(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []))),
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

describe('ProjectPageFieldsComponent', getEntityPageFieldsTest(mockItem, ProjectPageFieldsComponent));
