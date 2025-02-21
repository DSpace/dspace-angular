import {
  Observable,
  of as observableOf,
} from 'rxjs';

import {
  buildPaginatedList,
  PaginatedList,
} from '../../data';
import { RemoteData } from '../../data';
import { PageInfo } from '../../shared';
import { Vocabulary } from '../../submission';
import { VocabularyEntry } from '../../submission';
import { VocabularyOptions } from '../../submission';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';

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
    return observableOf(Object.assign(new VocabularyEntry(), { authority: 1, display: 'one', value: 1 }));
  }

  getVocabularyEntryByID(id: string, vocabularyOptions: VocabularyOptions): Observable<VocabularyEntry> {
    return observableOf(Object.assign(new VocabularyEntry(), { authority: 1, display: 'one', value: 1 }));
  }

  findVocabularyById(id: string): Observable<RemoteData<Vocabulary>> {
    return createSuccessfulRemoteDataObject$(Object.assign(new Vocabulary(), { id: 1, name: 'one', type: 'one' }));
  }

  getVocabularyByMetadataAndCollection(metadataField: string, collectionUUID: string): Observable<RemoteData<Vocabulary>> {
    return createSuccessfulRemoteDataObject$(null);
  }
}
