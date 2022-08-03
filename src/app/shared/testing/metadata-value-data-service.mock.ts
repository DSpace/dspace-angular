import { VocabularyEntry } from '../../core/submission/vocabularies/models/vocabulary-entry.model';
import { Observable } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { buildPaginatedList , PaginatedList} from '../../core/data/paginated-list.model';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { PageInfo } from '../../core/shared/page-info.model';

/**
 * The MetadataValueServiceMock for the test purposes.
 */
export class MockMetadataValueService {
  private _payload = [
    Object.assign(new VocabularyEntry(), { display: 'one', value: 1 }),
  ];

  findByMetadataNameAndByValue(metadataName: string, term: string): Observable<RemoteData<PaginatedList<VocabularyEntry>>> {
    return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), this._payload));
  }
}
