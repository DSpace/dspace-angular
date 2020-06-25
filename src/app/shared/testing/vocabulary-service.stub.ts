import { Observable } from 'rxjs';

import { VocabularyFindOptions } from '../../core/submission/vocabularies/models/vocabulary-find-options.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { VocabularyEntry } from '../../core/submission/vocabularies/models/vocabulary-entry.model';
import { PaginatedList } from '../../core/data/paginated-list';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { RemoteData } from '../../core/data/remote-data';


export class VocabularyServiceStub {

  private _payload = [
    Object.assign(new VocabularyEntry(),{authority: 1, display: 'one', value: 1}),
    Object.assign(new VocabularyEntry(),{authority: 2, display: 'two', value: 2}),
  ];

  setNewPayload(payload) {
    this._payload = payload;
  }

  getList() {
    return this._payload
  }

  getVocabularyEntries(options: VocabularyFindOptions): Observable<RemoteData<PaginatedList<VocabularyEntry>>> {
    return createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), this._payload));
  }
}
