/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { createPaginatedList } from './utils.test';
import { Observable } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { BrowseDefinition } from '../../core/shared/browse-definition.model';

/**
 * Stub class of {@link BrowseService}.
 */
export class BrowseServiceStub {
  getBrowseDefinitions(): Observable<RemoteData<PaginatedList<BrowseDefinition>>> {
    return createSuccessfulRemoteDataObject$(createPaginatedList([]));
  }
}
