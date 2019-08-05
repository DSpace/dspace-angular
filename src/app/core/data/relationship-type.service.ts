import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { hasValue, hasValueOperator, isNotEmptyOperator } from '../../shared/empty.util';
import { distinctUntilChanged, filter, flatMap, map, switchMap, take, tap } from 'rxjs/operators';
import {
  configureRequest,
  filterSuccessfulResponses,
  getRemoteDataPayload, getResponseFromEntry,
  getSucceededRemoteData
} from '../shared/operators';
import { DeleteRequest, FindAllOptions, FindAllRequest, GetRequest, PostRequest, RestRequest } from './request.models';
import { Observable } from 'rxjs/internal/Observable';
import { RestResponse } from '../cache/response.models';
import { Item } from '../shared/item.model';
import { Relationship } from '../shared/item-relationships/relationship.model';
import { RelationshipType } from '../shared/item-relationships/relationship-type.model';
import { RemoteData } from './remote-data';
import { combineLatest as observableCombineLatest } from 'rxjs/internal/observable/combineLatest';
import { zip as observableZip } from 'rxjs';
import { PaginatedList } from './paginated-list';
import { ItemDataService } from './item-data.service';
import {
  compareArraysUsingIds, filterRelationsByTypeLabel,
  relationsToItems
} from '../../+item-page/simple/item-types/shared/item-relationships-utils';

/**
 * The service handling all relationship requests
 */
@Injectable()
export class RelationshipTypeService {
  protected linkPath = 'relationshiptypes';

  constructor(protected requestService: RequestService,
              protected halService: HALEndpointService,
              protected rdbService: RemoteDataBuildService) {
  }

  /**
   * Get the endpoint for a relationship type by ID
   * @param id
   */
  getRelationshipTypeEndpoint(id: number) {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((href: string) => `${href}/${id}`)
    );
  }

  getAllRelationshipTypes(options: FindAllOptions): Observable<RemoteData<PaginatedList<RelationshipType>>> {
    const link$ = this.halService.getEndpoint(this.linkPath);
    return link$
      .pipe(
        map((endpointURL: string) => new FindAllRequest(this.requestService.generateRequestId(), endpointURL, options)),
        configureRequest(this.requestService),
        switchMap(() => this.rdbService.buildList(link$))
      );
  }

  /**
   * Get the RelationshipType for a relationship type by label
   * @param label
   */
  getRelationshipTypeByLabel(label: string): Observable<RelationshipType> {
    return this.getAllRelationshipTypes({ currentPage: 1, elementsPerPage: Number.MAX_VALUE }).pipe(
      map((typeListRD: RemoteData<PaginatedList<RelationshipType>>) =>
        typeListRD.payload.page.find((type: RelationshipType) =>
          type.leftLabel === label || type.rightLabel === label
        )
      ),
    );
  }
}
