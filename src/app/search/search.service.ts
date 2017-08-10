import { Injectable } from '@angular/core';
import { RemoteData } from '../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { SearchResult } from './search-result.model';
import { ItemDataService } from '../core/data/item-data.service';
import { PageInfo } from '../core/shared/page-info.model';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { SearchOptions } from './search.models';
import { hasValue, isNotEmpty } from '../shared/empty.util';
import { Metadatum } from '../core/shared/metadatum.model';
import { Item } from '../core/shared/item.model';

@Injectable()
export class SearchService {

  totalPages = 5;
  mockedHighlights: string[] = new Array(
    'This is a <em>sample abstract</em>.',
    'This is a sample abstract. But, to fill up some space, here\'s <em>"Hello"</em> in several different languages : ',
    'This is a Sample HTML webpage including several <em>images</em> and styles (CSS).',
    'This is <em>really</em> just a sample abstract. But, Í’vé thrown ïn a cõuple of spëciâl charactèrs för êxtrå fuñ!',
    'This abstract is <em>really quite great</em>',
    'The solution structure of the <em>bee</em> venom neurotoxin',
    'BACKGROUND: The <em>Open Archive Initiative (OAI)</em> refers to a movement started around the \'90 s to guarantee free access to scientific information',
    'The collision fault detection of a <em>XXY</em> stage is proposed for the first time in this paper',
    '<em>This was blank in the actual item, no abstract</em>',
    '<em>The QSAR DataBank (QsarDB) repository</em>',
  );

  constructor(private itemDataService: ItemDataService) {
  }

  search(query: string, scopeId?: string, searchOptions?: SearchOptions): RemoteData<Array<SearchResult<DSpaceObject>>> {
    let self = `https://dspace7.4science.it/dspace-spring-rest/api/search?query=${query}`;
    if (hasValue(scopeId)) {
      self += `&scope=${scopeId}`;
    }
    if (isNotEmpty(searchOptions) && hasValue(searchOptions.currentPage)) {
      self += `&page=${searchOptions.currentPage}`;
    }
    const requestPending = Observable.of(false);
    const responsePending = Observable.of(false);
    const isSuccessFul = Observable.of(true);
    const errorMessage = Observable.of(undefined);
    const statusCode = Observable.of('200');
    const returningPageInfo = new PageInfo();

    if (isNotEmpty(searchOptions)) {
      returningPageInfo.elementsPerPage = searchOptions.elementsPerPage;
      returningPageInfo.currentPage = searchOptions.currentPage;
    } else {
      returningPageInfo.elementsPerPage = 10;
      returningPageInfo.currentPage = 1;
    }
    returningPageInfo.totalPages = this.totalPages;
    returningPageInfo.totalElements = 10 * this.totalPages;
    const pageInfo = Observable.of(returningPageInfo);

    const itemsRD = this.itemDataService.findAll({
      scopeID: '8e0928a0-047a-4369-8883-12669f32dd64',
      currentPage: returningPageInfo.currentPage,
      elementsPerPage: returningPageInfo.elementsPerPage
    });
    const payload = itemsRD.payload.map((items: Item[]) => {
      return items.sort(()=>{
        const values = [-1, 0, 1];
        return values[Math.floor(Math.random() * values.length)];
      })
      .map((item: Item, index: number) => {
        const mockResult: SearchResult<DSpaceObject> = new SearchResult();
        mockResult.dspaceObject = item;
        const highlight = new Metadatum();
        highlight.key = 'dc.description.abstract';
        highlight.value = this.mockedHighlights[index % this.mockedHighlights.length];
        mockResult.hitHighlights = new Array(highlight);
        return mockResult;
      });
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
