import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { filter, find, map, switchMap } from 'rxjs/operators';
import { configureRequest, getSucceededRemoteData } from '../shared/operators';
import { Observable } from 'rxjs/internal/Observable';
import { RelationshipType } from '../shared/item-relationships/relationship-type.model';
import { RemoteData } from './remote-data';
import { PaginatedList } from './paginated-list';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { ItemType } from '../shared/item-relationships/item-type.model';
import { isNotUndefined } from '../../shared/empty.util';
import { FindListOptions, FindListRequest } from './request.models';

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

  getAllRelationshipTypes(options: FindListOptions): Observable<RemoteData<PaginatedList<RelationshipType>>> {
    const link$ = this.halService.getEndpoint(this.linkPath);
    return link$
      .pipe(
        map((endpointURL: string) => new FindListRequest(this.requestService.generateRequestId(), endpointURL, options)),
        configureRequest(this.requestService),
        switchMap(() => this.rdbService.buildList(link$))
      ) as Observable<RemoteData<PaginatedList<RelationshipType>>>;
  }

  /**
   * Get the RelationshipType for a relationship type by label
   * @param label
   */
  getRelationshipTypeByLabelAndTypes(label: string, firstType: string, secondType: string): Observable<RelationshipType> {
    return this.getAllRelationshipTypes({ currentPage: 1, elementsPerPage: Number.MAX_VALUE })
      .pipe(
        getSucceededRemoteData(),
        /* Flatten the page so we can treat it like an observable */
        switchMap((typeListRD: RemoteData<PaginatedList<RelationshipType>>) => typeListRD.payload.page),
        switchMap((type: RelationshipType) => {
          if (type.leftwardType === label) {
            return this.checkType(type, firstType, secondType);
          } else if (type.rightwardType === label) {
            return this.checkType(type, secondType, firstType);
          } else {
            return [];
          }
        }),
      );
  }

  // Check if relationship type matches the given types
  // returns a void observable if there's not match
  // returns an observable that emits the relationship type when there is a match
  private checkType(type: RelationshipType, firstType: string, secondType: string): Observable<RelationshipType> {
    const entityTypes = observableCombineLatest(type.leftType.pipe(getSucceededRemoteData()), type.rightType.pipe(getSucceededRemoteData()));
    return entityTypes.pipe(
      find(([leftTypeRD, rightTypeRD]: [RemoteData<ItemType>, RemoteData<ItemType>]) => leftTypeRD.payload.label === firstType && rightTypeRD.payload.label === secondType),
      filter((types) => isNotUndefined(types)),
      map(() => type)
    );
  }
}
