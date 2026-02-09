import {
  EMPTY,
  Observable,
} from 'rxjs';

import {
  buildPaginatedList,
  PaginatedList,
} from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { BrowseDefinition } from '../shared/browse-definition.model';
import { FlatBrowseDefinition } from '../shared/flat-browse-definition.model';
import { HierarchicalBrowseDefinition } from '../shared/hierarchical-browse-definition.model';
import { PageInfo } from '../shared/page-info.model';
import { ValueListBrowseDefinition } from '../shared/value-list-browse-definition.model';
import { createSuccessfulRemoteDataObject$ } from '../utilities/remote-data.utils';

const mockData = [
  Object.assign(new FlatBrowseDefinition(), {
    'id': 'dateissued',
    'browseType': 'flatBrowse',
    'dataType': 'date',
    'sortOptions': EMPTY,
    'order': 'ASC',
    'type': 'browse',
    'metadataKeys': [
      'dc.date.issued',
    ],
    '_links': EMPTY,
  }),

  Object.assign(new ValueListBrowseDefinition(), {
    'id': 'author',
    'browseType': 'valueList',
    'dataType': 'text',
    'sortOptions': EMPTY,
    'order': 'ASC',
    'type': 'browse',
    'metadataKeys': [
      'dc.contributor.*',
      'dc.creator',
    ],
    '_links': EMPTY,
  }),

  Object.assign(new FlatBrowseDefinition(), {
    'id': 'title',
    'browseType': 'flatBrowse',
    'dataType': 'title',
    'sortOptions': EMPTY,
    'order': 'ASC',
    'type': 'browse',
    'metadataKeys': [
      'dc.title',
    ],
    '_links': EMPTY,
  }),

  Object.assign(new ValueListBrowseDefinition(), {
    'id': 'subject',
    'browseType': 'valueList',
    'dataType': 'text',
    'sortOptions': EMPTY,
    'order': 'ASC',
    'type': 'browse',
    'metadataKeys': [
      'dc.subject.*',
    ],
    '_links': EMPTY,
  }),

  Object.assign(new HierarchicalBrowseDefinition(), {
    'id': 'srsc',
    'browseType': 'hierarchicalBrowse',
    'facetType': 'subject',
    'vocabulary': 'srsc',
    'type': 'browse',
    'metadataKeys': [
      'dc.subject',
    ],
    '_links': EMPTY,
  }),
];
export const BrowseServiceStub: any = {
  /**
   * Get all browse definitions.
   */
  getBrowseDefinitions(): Observable<RemoteData<PaginatedList<BrowseDefinition>>> {
    return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), mockData));
  },
};
