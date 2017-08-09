import { Injectable } from '@angular/core';
import { RemoteData } from '../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { SearchResult } from './searchresult.model';
import { ItemDataService } from '../core/data/item-data.service';
import { PageInfo } from '../core/shared/page-info.model';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { SearchOptions } from './search.models';
import { hasValue } from '../shared/empty.util';

@Injectable()
export class SearchService {

  totalPages : number = 5;
  idsToMock: string[] = new Array(
    'ed5d5f21-1ce4-4b06-b7c2-a7272835ade0',
    '0ec7ff22-f211-40ab-a69e-c819b0b1f357',
    '9f3288b2-f2ad-454f-9f4c-70325646dcee',
    'fdf0175b-6b0c-421f-9266-28b04341b940',
    'dbe26193-2fa0-4d6c-9f52-edd3572b65a0',
    '6212604b-c778-42b3-88e4-cc3b1262ad28',
    'a352a28f-fd5f-4c7b-81bb-06a28b4ea780',
    '55a24a8a-1a2f-4fee-b5e8-ca07826d9ff3',
    '75664e4e-0000-48e5-b2b6-fbe51ad05f92',
    '848e4058-d7b2-482a-b481-e681e7c4016b',
  );

  constructor(private itemDataService: ItemDataService) {
  }

  search(query: string, scopeId: string, searchOptions: SearchOptions): RemoteData<SearchResult<DSpaceObject>[]> {
    let self = `https://dspace7.4science.it/dspace-spring-rest/api/search?query=${query}&scope=${scopeId}`;
    if(hasValue(searchOptions.currentPage)){
      self+=`&currentPage=${searchOptions.currentPage}`;
    }
    const requestPending = Observable.of(false);
    const responsePending = Observable.of(false);
    const isSuccessFul = Observable.of(true);
    const errorMessage = Observable.of(undefined);
    const statusCode = Observable.of('200');
    let returningPageInfo = new PageInfo();

    returningPageInfo.elementsPerPage = searchOptions.elementsPerPage;
    returningPageInfo.currentPage = searchOptions.currentPage;
    returningPageInfo.totalPages = this.totalPages;
    returningPageInfo.totalElements= this.idsToMock.length*this.totalPages;
    const pageInfo = Observable.of(returningPageInfo);

    let mockSearchResults: SearchResult<DSpaceObject>[] = [];
    let dsoObsArr = [];
    this.idsToMock = this.idsToMock

    this.idsToMock.forEach(id => {
      let remoteObject: RemoteData<DSpaceObject> = this.itemDataService.findById(id);

      let dsoObs = remoteObject.payload.take(1);
      dsoObsArr.push(dsoObs);
      dsoObs.subscribe((dso: DSpaceObject) => {
        let mockResult: SearchResult<DSpaceObject> = new SearchResult();
        mockResult.result = dso;
        // Just return the first metadatum as a "highlight"
        mockResult.hitHiglights = dso.metadata.slice(0, 1);
        mockSearchResults.push(mockResult);
      });
    });

    // combineLatest ->Merges observables. When this is done, put the "mockSearchResults" as a payload
    const payload = Observable.combineLatest(...dsoObsArr
      , () => {
        // Shuffle the searchresult to mimick a changed in the query
        let randomization: number[] = new Array(-1, 0, 1);
        let number = randomization[ Math.floor(Math.random() * randomization.length) ];
        return mockSearchResults.sort(() => number);
      });

    return new RemoteData(
      self,
      requestPending,
      responsePending,
      isSuccessFul,
      errorMessage,
      statusCode,
      pageInfo,
      payload
    )
  }
}
