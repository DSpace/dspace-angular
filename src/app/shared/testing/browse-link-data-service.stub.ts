import { EMPTY, Observable, of as observableOf } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { buildPaginatedList, PaginatedList } from '../../core/data/paginated-list.model';
import { BrowseDefinition } from '../../core/shared/browse-definition.model';
import {
  getPaginatedListPayload,
  getRemoteDataPayload
} from '../../core/shared/operators';
import { BrowseService } from '../../core/browse/browse.service';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { isEmpty, isNotEmpty } from '../empty.util';
import { createSuccessfulRemoteDataObject } from '../remote-data.utils';
import { PageInfo } from '../../core/shared/page-info.model';

// This data is in post-serialized form (metadata -> metadataKeys)
export const mockData: BrowseDefinition[] = [
      Object.assign(new BrowseDefinition, {
      "id" : "dateissued",
      "metadataBrowse" : false,
      "dataType" : "date",
      "sortOptions" : EMPTY,
      "order" : "ASC",
      "type" : "browse",
      "metadataKeys" : [ "dc.date.issued" ],
      "_links" : EMPTY
     }),
     Object.assign(new BrowseDefinition, {
      "id" : "author",
      "metadataBrowse" : true,
      "dataType" : "text",
      "sortOptions" : EMPTY,
      "order" : "ASC",
      "type" : "browse",
      "metadataKeys" : [ "dc.contributor.*", "dc.creator" ],
      "_links" : EMPTY
    })
];


export const browseLinkDataServiceStub: any = {
  /**
   * Get all BrowseDefinitions
   */
  getBrowseLinks(): Observable<RemoteData<PaginatedList<BrowseDefinition>>> {
    return observableOf(createSuccessfulRemoteDataObject(buildPaginatedList(new PageInfo(), mockData)));
  },
  /**
   * Get the browse URL by providing a list of metadata keys
   * @param metadatumKey
   * @param linkPath
   */
  getBrowseLinkFor(metadataKeys: string[]): Observable<BrowseDefinition> {
    let searchKeyArray: string[] = [];
    metadataKeys.forEach((metadataKey) => {
      searchKeyArray = searchKeyArray.concat(BrowseService.toSearchKeyArray(metadataKey));
    })
    return this.getBrowseLinks().pipe(
      getRemoteDataPayload(),
      getPaginatedListPayload(),
      map((browseDefinitions: BrowseDefinition[]) => browseDefinitions
        .find((def: BrowseDefinition) => {
          const matchingKeys = def.metadataKeys.find((key: string) => searchKeyArray.indexOf(key) >= 0);
          return isNotEmpty(matchingKeys);
        })
      ),
      map((def: BrowseDefinition) => {
        if (isEmpty(def) || isEmpty(def.id)) {
          //throw new Error(`A browse definition for field ${metadataKey} isn't configured`);
        } else {
          return def;
        }
      }),
      startWith(undefined),
      distinctUntilChanged()
    );
  }
}
