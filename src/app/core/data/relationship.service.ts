import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { hasValue, hasValueOperator, isNotEmptyOperator } from '../../shared/empty.util';
import { distinctUntilChanged, flatMap, map, switchMap, take, tap } from 'rxjs/operators';
import {
  configureRequest,
  filterSuccessfulResponses,
  getRemoteDataPayload,
  getSucceededRemoteData
} from '../shared/operators';
import { DeleteRequest, RestRequest } from './request.models';
import { Observable } from 'rxjs/internal/Observable';
import { RestResponse } from '../cache/response.models';
import { Item } from '../shared/item.model';
import { Relationship } from '../shared/item-relationships/relationship.model';
import { RelationshipType } from '../shared/item-relationships/relationship-type.model';
import { RemoteData } from './remote-data';
import {
  compareArraysUsingIds,
  filterRelationsByTypeLabel, relationsToItems
} from '../../+item-page/simple/item-types/shared/item.component';
import { combineLatest as observableCombineLatest } from 'rxjs/internal/observable/combineLatest';
import { zip as observableZip } from 'rxjs';
import { PaginatedList } from './paginated-list';
import { ItemDataService } from './item-data.service';

/**
 * The service handling all relationship requests
 */
@Injectable()
export class RelationshipService {
  protected linkPath = 'relationships';

  constructor(protected requestService: RequestService,
              protected halService: HALEndpointService,
              protected rdbService: RemoteDataBuildService,
              protected itemService: ItemDataService) {
  }

  /**
   * Get the endpoint for a relationship by ID
   * @param uuid
   */
  getRelationshipEndpoint(uuid: string) {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((href: string) => `${href}/${uuid}`)
    );
  }

  /**
   * Send a delete request for a relationship by ID
   * @param uuid
   */
  deleteRelationship(uuid: string): Observable<RestResponse> {
    return this.getRelationshipEndpoint(uuid).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpointURL: string) => new DeleteRequest(this.requestService.generateRequestId(), endpointURL)),
      configureRequest(this.requestService),
      switchMap((restRequest: RestRequest) => this.requestService.getByUUID(restRequest.uuid)),
      filterSuccessfulResponses()
    );
  }

  /**
   * Get a combined observable containing an array of all relationships in an item, as well as an array of the relationships their types
   * This is used for easier access of a relationship's type because they exist as observables
   * @param item
   */
  getItemResolvedRelsAndTypes(item: Item): Observable<[Relationship[], RelationshipType[]]> {
    const relationships$ = this.getItemRelationshipsArray(item);

    const relationshipTypes$ = relationships$.pipe(
      flatMap((rels: Relationship[]) =>
        observableZip(...rels.map((rel: Relationship) => rel.relationshipType)).pipe(
          map(([...arr]: Array<RemoteData<RelationshipType>>) => arr.map((d: RemoteData<RelationshipType>) => d.payload).filter((type) => hasValue(type)))
        )
      ),
      distinctUntilChanged(compareArraysUsingIds())
    );

    return observableCombineLatest(
      relationships$,
      relationshipTypes$
    );
  }

  /**
   * Get an item their relationships in the form of an array
   * @param item
   */
  getItemRelationshipsArray(item: Item): Observable<Relationship[]> {
    return item.relationships.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      map((rels: PaginatedList<Relationship>) => rels.page),
      hasValueOperator(),
      distinctUntilChanged(compareArraysUsingIds())
    );
  }

  /**
   * Get an array of an item their unique relationship type's labels
   * The array doesn't contain any duplicate labels
   * @param item
   */
  getItemRelationshipLabels(item: Item): Observable<string[]> {
    return this.getItemResolvedRelsAndTypes(item).pipe(
      map(([relsCurrentPage, relTypesCurrentPage]) => {
        return relTypesCurrentPage.map((type, index) => {
          const relationship = relsCurrentPage[index];
          if (relationship.leftId === item.uuid) {
            return type.leftLabel;
          } else {
            return type.rightLabel;
          }
        });
      }),
      map((labels: string[]) => Array.from(new Set(labels)))
    )
  }

  /**
   * Resolve a given item's relationships into related items and return the items as an array
   * @param item
   */
  getRelatedItems(item: Item): Observable<Item[]> {
    return this.getItemRelationshipsArray(item).pipe(
      relationsToItems(item.uuid, this.itemService)
    );
  }

  /**
   * Resolve a given item's relationships into related items, filtered by a relationship label
   * and return the items as an array
   * @param item
   * @param label
   */
  getRelatedItemsByLabel(item: Item, label: string): Observable<Item[]> {
    return this.getItemResolvedRelsAndTypes(item).pipe(
      filterRelationsByTypeLabel(label),
      relationsToItems(item.uuid, this.itemService)
    );
  }

}
