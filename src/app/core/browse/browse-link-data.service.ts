import { Injectable } from '@angular/core';
import { BrowseDefinition } from '../shared/browse-definition.model';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Observable } from 'rxjs';
import { RemoteData } from '../data/remote-data';
import { PaginatedList } from '../data/paginated-list.model';
import { IdentifiableDataService } from '../data/base/identifiable-data.service';
import { FindAllDataImpl } from '../data/base/find-all-data';
import { BrowseDefinitionDataService } from './browse-definition-data.service';
import {
  getFirstSucceededRemoteData, getPaginatedListPayload, getRemoteDataPayload
} from '../shared/operators';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { isEmpty, isNotEmpty } from '../../shared/empty.util';
import { BrowseService } from './browse.service';

/**
 * Data service responsible for retrieving browse definitions from the REST server, IF AND ONLY IF
 * they are configured as browse links (webui.browse.link.<n>)
 */
@Injectable()
export class BrowseLinkDataService extends IdentifiableDataService<BrowseDefinition> {
  private findAllData: FindAllDataImpl<BrowseDefinition>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected browseDefinitionDataService: BrowseDefinitionDataService
  ) {
    super('browselinks', requestService, rdbService, objectCache, halService);
    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  /**
   * Get all BrowseDefinitions
   */
  getBrowseLinks(): Observable<RemoteData<PaginatedList<BrowseDefinition>>> {
    return this.findAllData.findAll({ elementsPerPage: 9999 }).pipe(
      getFirstSucceededRemoteData(),
    );
  }


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

