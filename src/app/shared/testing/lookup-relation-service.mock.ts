import { Observable } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { buildPaginatedList , PaginatedList} from '../../core/data/paginated-list.model';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { PageInfo } from '../../core/shared/page-info.model';
import { ExternalSource } from '../../core/shared/external-source.model';
import { PaginatedSearchOptions } from '../search/models/paginated-search-options.model';
import { ExternalSourceEntry } from '../../core/shared/external-source-entry.model';

/**
 * The LookupRelationServiceMock for the test purposes.
 */
export class MockLookupRelationService {
  private _payload = [];

  getExternalResults(externalSource: ExternalSource, searchOptions: PaginatedSearchOptions): Observable<RemoteData<PaginatedList<ExternalSourceEntry>>> {
    return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), this._payload));
  }
}
