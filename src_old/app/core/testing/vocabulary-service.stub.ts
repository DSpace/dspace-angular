import {
  Observable,
  of,
} from 'rxjs';

import {
  buildPaginatedList,
  PaginatedList,
} from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { PageInfo } from '../shared/page-info.model';
import { Vocabulary } from '../submission/vocabularies/models/vocabulary.model';
import { VocabularyEntry } from '../submission/vocabularies/models/vocabulary-entry.model';
import { VocabularyOptions } from '../submission/vocabularies/models/vocabulary-options.model';
import { createSuccessfulRemoteDataObject$ } from '../utilities/remote-data.utils';

export class VocabularyServiceStub {

  private _payload = [
    Object.assign(new VocabularyEntry(), { authority: 1, display: 'one', value: 1 }),
    Object.assign(new VocabularyEntry(), { authority: 2, display: 'two', value: 2 }),
  ];

  setNewPayload(payload) {
    this._payload = payload;
  }

  getList() {
    return this._payload;
  }

  getVocabularyEntries(vocabularyOptions: VocabularyOptions, pageInfo: PageInfo): Observable<RemoteData<PaginatedList<VocabularyEntry>>> {
    return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), this._payload));
  }

  getVocabularyEntriesByValue(value: string, exact: boolean, vocabularyOptions: VocabularyOptions, pageInfo: PageInfo): Observable<RemoteData<PaginatedList<VocabularyEntry>>> {
    return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), this._payload));
  }

  getVocabularyEntryByValue(value: string, vocabularyOptions: VocabularyOptions): Observable<VocabularyEntry> {
    return of(Object.assign(new VocabularyEntry(), { authority: 1, display: 'one', value: 1 }));
  }

  getVocabularyEntryByID(id: string, vocabularyOptions: VocabularyOptions): Observable<VocabularyEntry> {
    return of(Object.assign(new VocabularyEntry(), { authority: 1, display: 'one', value: 1 }));
  }

  findVocabularyById(id: string): Observable<RemoteData<Vocabulary>> {
    return createSuccessfulRemoteDataObject$(Object.assign(new Vocabulary(), { id: 1, name: 'one', type: 'one' }));
  }

  getVocabularyByMetadataAndCollection(metadataField: string, collectionUUID: string): Observable<RemoteData<Vocabulary>> {
    return createSuccessfulRemoteDataObject$(null);
  }
}
