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
import { DeleteRequest, RestRequest } from './request.models';
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
import { ObjectCacheService } from '../cache/object-cache.service';

/**
 * The service handling all relationship requests
 */
@Injectable()
export class RelationshipService {
  protected linkPath = 'relationships';

  constructor(protected requestService: RequestService,
              protected halService: HALEndpointService,
              protected rdbService: RemoteDataBuildService,
              protected itemService: ItemDataService,
              protected objectCache: ObjectCacheService) {
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
   * Find a relationship by its UUID
   * @param uuid
   */
  findById(uuid: string): Observable<RemoteData<Relationship>> {
    const href$ = this.getRelationshipEndpoint(uuid);
    return this.rdbService.buildSingle<Relationship>(href$);
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
      getResponseFromEntry(),
      tap(() => this.clearRelatedCache(uuid))
    );
  }

  /**
   * Get a combined observable containing an array of all relationships in an item, as well as an array of the relationships their types
   * This is used for easier access of a relationship's type because they exist as observables
   * @param item
   */
  getItemResolvedRelsAndTypes(item: Item): Observable<[Relationship[], RelationshipType[]]> {
    return observableCombineLatest(
      this.getItemRelationshipsArray(item),
      this.getItemRelationshipTypesArray(item)
    );
  }

  /**
   * Get a combined observable containing an array of all the item's relationship's left- and right-side items, as well as an array of the relationships their types
   * This is used for easier access of a relationship's type and left and right items because they exist as observables
   * @param item
   */
  getItemResolvedRelatedItemsAndTypes(item: Item): Observable<[Item[], Item[], RelationshipType[]]> {
    return observableCombineLatest(
      this.getItemLeftRelatedItemArray(item),
      this.getItemRightRelatedItemArray(item),
      this.getItemRelationshipTypesArray(item)
    );
  }

  /**
   * Get a combined observable containing an array of all the item's relationship's left- and right-side items, as well as an array of the relationships themselves
   * This is used for easier access of the relationship and their left and right items because they exist as observables
   * @param item
   */
  getItemResolvedRelatedItemsAndRelationships(item: Item): Observable<[Item[], Item[], Relationship[]]> {
    return observableCombineLatest(
      this.getItemLeftRelatedItemArray(item),
      this.getItemRightRelatedItemArray(item),
      this.getItemRelationshipsArray(item)
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
   * Get an item their relationship types in the form of an array
   * @param item
   */
  getItemRelationshipTypesArray(item: Item): Observable<RelationshipType[]> {
    return this.getItemRelationshipsArray(item).pipe(
      flatMap((rels: Relationship[]) =>
        observableZip(...rels.map((rel: Relationship) => rel.relationshipType)).pipe(
          map(([...arr]: Array<RemoteData<RelationshipType>>) => arr.map((d: RemoteData<RelationshipType>) => d.payload).filter((type) => hasValue(type))),
          filter((arr) => arr.length === rels.length)
        )
      ),
      distinctUntilChanged(compareArraysUsingIds())
    );
  }

  /**
   * Get an item his relationship's left-side related items in the form of an array
   * @param item
   */
  getItemLeftRelatedItemArray(item: Item): Observable<Item[]> {
    return this.getItemRelationshipsArray(item).pipe(
      flatMap((rels: Relationship[]) => observableZip(...rels.map((rel: Relationship) => rel.leftItem)).pipe(
        map(([...arr]: Array<RemoteData<Item>>) => arr.map((rd: RemoteData<Item>) => rd.payload).filter((i) => hasValue(i))),
        filter((arr) => arr.length === rels.length)
      )),
      distinctUntilChanged(compareArraysUsingIds())
    );
  }

  /**
   * Get an item his relationship's right-side related items in the form of an array
   * @param item
   */
  getItemRightRelatedItemArray(item: Item): Observable<Item[]> {
    return this.getItemRelationshipsArray(item).pipe(
      flatMap((rels: Relationship[]) => observableZip(...rels.map((rel: Relationship) => rel.rightItem)).pipe(
        map(([...arr]: Array<RemoteData<Item>>) => arr.map((rd: RemoteData<Item>) => rd.payload).filter((i) => hasValue(i))),
        filter((arr) => arr.length === rels.length)
      )),
      distinctUntilChanged(compareArraysUsingIds())
    );
  }

  /**
   * Get an array of an item their unique relationship type's labels
   * The array doesn't contain any duplicate labels
   * @param item
   */
  getItemRelationshipLabels(item: Item): Observable<string[]> {
    return this.getItemResolvedRelatedItemsAndTypes(item).pipe(
      map(([leftItems, rightItems, relTypesCurrentPage]) => {
        return relTypesCurrentPage.map((type, index) => {
          if (leftItems[index].uuid === item.uuid) {
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
      relationsToItems(item.uuid)
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
      relationsToItems(item.uuid)
    );
  }

  /**
   * Clear object and request caches of the items related to a relationship (left and right items)
   * @param uuid
   */
  clearRelatedCache(uuid: string) {
    this.findById(uuid).pipe(
      getSucceededRemoteData(),
      flatMap((rd: RemoteData<Relationship>) => observableCombineLatest(rd.payload.leftItem.pipe(getSucceededRemoteData()), rd.payload.rightItem.pipe(getSucceededRemoteData()))),
      take(1)
    ).subscribe(([leftItem, rightItem]) => {
      this.objectCache.remove(leftItem.payload.self);
      this.objectCache.remove(rightItem.payload.self);
      this.requestService.removeByHrefSubstring(leftItem.payload.self);
      this.requestService.removeByHrefSubstring(rightItem.payload.self);
    });
  }

}
