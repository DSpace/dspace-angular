import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { hasNoValue, hasValue, hasValueOperator, isNotEmptyOperator } from '../../shared/empty.util';
import { distinctUntilChanged, filter, map, mergeMap, skip, startWith, switchMap, take, tap } from 'rxjs/operators';
import { configureRequest, getRemoteDataPayload, getResponseFromEntry, getSucceededRemoteData } from '../shared/operators';
import { DeleteRequest, FindAllOptions, PostRequest, RestRequest } from './request.models';
import { Observable } from 'rxjs/internal/Observable';
import { RestResponse } from '../cache/response.models';
import { Item } from '../shared/item.model';
import { Relationship } from '../shared/item-relationships/relationship.model';
import { RelationshipType } from '../shared/item-relationships/relationship-type.model';
import { RemoteData } from './remote-data';
import { combineLatest, combineLatest as observableCombineLatest } from 'rxjs';
import { PaginatedList } from './paginated-list';
import { ItemDataService } from './item-data.service';
import { compareArraysUsingIds, relationsToItems } from '../../+item-page/simple/item-types/shared/item-relationships-utils';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { DataService } from './data.service';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';

/**
 * The service handling all relationship requests
 */
@Injectable()
export class RelationshipService extends DataService<Relationship> {
  protected linkPath = 'relationships';
  protected forceBypassCache = false;

  constructor(protected itemService: ItemDataService,
              protected requestService: RequestService,
              protected rdbService: RemoteDataBuildService,
              protected dataBuildService: NormalizedObjectBuildService,
              protected store: Store<CoreState>,
              protected halService: HALEndpointService,
              protected objectCache: ObjectCacheService,
              protected notificationsService: NotificationsService,
              protected http: HttpClient,
              protected comparator: DefaultChangeAnalyzer<Relationship>) {
    super();
  }

  getBrowseEndpoint(options: FindAllOptions = {}, linkPath: string = this.linkPath): Observable<string> {
    return this.halService.getEndpoint(linkPath);
  }

  /**
   * Get the endpoint for a relationship by ID
   * @param uuid
   */
  getRelationshipEndpoint(uuid: string) {
    return this.getBrowseEndpoint().pipe(
      map((href: string) => `${href}/${uuid}`)
    );
  }

  /**
   * Send a delete request for a relationship by ID
   * @param id
   */
  deleteRelationship(id: string): Observable<RestResponse> {
    return this.getRelationshipEndpoint(id).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpointURL: string) => new DeleteRequest(this.requestService.generateRequestId(), endpointURL)),
      configureRequest(this.requestService),
      switchMap((restRequest: RestRequest) => this.requestService.getByUUID(restRequest.uuid)),
      getResponseFromEntry(),
      tap(() => this.removeRelationshipItemsFromCacheByRelationship(id))
    );
  }

  addRelationship(typeId: string, item1: Item, item2: Item): Observable<RestResponse> {
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/uri-list');
    options.headers = headers;
    return this.halService.getEndpoint(this.linkPath).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpointUrl: string) => `${endpointUrl}?relationshipType=${typeId}`),
      map((endpointURL: string) => new PostRequest(this.requestService.generateRequestId(), endpointURL, `${item1.self} \n ${item2.self}`, options)),
      configureRequest(this.requestService),
      switchMap((restRequest: RestRequest) => this.requestService.getByUUID(restRequest.uuid)),
      getResponseFromEntry(),
      tap(() => this.removeRelationshipItemsFromCache(item1)),
      tap(() => this.removeRelationshipItemsFromCache(item2))
    );
  }

  private removeRelationshipItemsFromCacheByRelationship(relationshipId: string) {
    this.findById(relationshipId).pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      switchMap((relationship: Relationship) => combineLatest(
        relationship.leftItem.pipe(getSucceededRemoteData(), getRemoteDataPayload()),
        relationship.rightItem.pipe(getSucceededRemoteData(), getRemoteDataPayload())
        )
      ),
      take(1)
    ).subscribe(([item1, item2]) => {
      this.removeRelationshipItemsFromCache(item1);
      this.removeRelationshipItemsFromCache(item2);
    })
  }

  private removeRelationshipItemsFromCache(item) {
    this.objectCache.remove(item.self);
    this.requestService.removeByHrefSubstring(item.self);
    combineLatest(
      this.objectCache.hasBySelfLinkObservable(item.self),
      this.requestService.hasByHrefObservable(item.self)
    ).pipe(
      filter(([existsInOC, existsInRC]) => !existsInOC && !existsInRC),
      take(1),
      switchMap(() => this.itemService.findByHref(item.self).pipe(take(1)))
    ).subscribe();
  }

  /**
   * Get an item its relationships in the form of an array
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
   * Get an array of the labels of an item’s unique relationship types
   * The array doesn't contain any duplicate labels
   * @param item
   */
  getRelationshipTypeLabelsByItem(item: Item): Observable<string[]> {
    return this.getItemRelationshipsArray(item).pipe(
      switchMap((relationships: Relationship[]) => observableCombineLatest(relationships.map((relationship: Relationship) => this.getRelationshipTypeLabelByRelationshipAndItem(relationship, item)))),
      map((labels: string[]) => Array.from(new Set(labels)))
    );
  }

  private getRelationshipTypeLabelByRelationshipAndItem(relationship: Relationship, item: Item): Observable<string> {
    return relationship.leftItem.pipe(
      getSucceededRemoteData(),
      map((itemRD: RemoteData<Item>) => itemRD.payload),
      switchMap((otherItem: Item) => relationship.relationshipType.pipe(
        getSucceededRemoteData(),
        map((relationshipTypeRD) => relationshipTypeRD.payload),
        map((relationshipType: RelationshipType) => {
          if (otherItem.uuid == item.uuid) {
            return relationshipType.leftLabel;
          } else {
            return relationshipType.rightLabel;
          }
        })
        )
      ))
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
    return this.getItemRelationshipsByLabel(item, label).pipe(relationsToItems(item.uuid));
  }


  /**
   * Resolve a given item's relationships into related items, filtered by a relationship label
   * and return the items as an array
   * @param item
   * @param label
   */
  getItemRelationshipsByLabel(item: Item, label: string): Observable<Relationship[]> {
    return this.getItemRelationshipsArray(item).pipe(
      switchMap((relationships: Relationship[]) => {
        return observableCombineLatest(
          ...relationships.map((relationship: Relationship) => {
            return relationship.relationshipType.pipe(
              getSucceededRemoteData(),
              getRemoteDataPayload(),
              map((relationshipType: RelationshipType) => {
                if (label === relationshipType.rightLabel || label === relationshipType.leftLabel) {
                  return relationship;
                } else {
                  return undefined;
                }
              }),
            )
          })
        )
      }),
      map((relationships: Relationship[]) =>
        relationships.filter((relationship: Relationship) => hasValue(relationship))
      ),
    );
  }


  /**
   * Method for fetching an item's relationships, but filtered by related item IDs (essentially performing a reverse lookup)
   * Only relationships where leftItem or rightItem's ID is present in the list provided will be returned
   * @param item
   * @param uuids
   */
  getRelationshipsByRelatedItemIds(item: Item, uuids: string[]): Observable<Relationship[]> {
    return this.getItemRelationshipsArray(item).pipe(
      switchMap((relationships: Relationship[]) => {
        return observableCombineLatest(...relationships.map((relationship: Relationship) => {
          const isLeftItem$ = this.isItemInUUIDArray(relationship.leftItem, uuids);
          const isRightItem$ = this.isItemInUUIDArray(relationship.rightItem, uuids);
          return observableCombineLatest(isLeftItem$, isRightItem$).pipe(
            filter(([isLeftItem, isRightItem]) => isLeftItem || isRightItem),
            map(() => relationship),
            startWith(undefined)
          );
        }))
      }),
      map((relationships: Relationship[]) => relationships.filter((relationship => hasValue(relationship)))),
    )
  }

  private isItemInUUIDArray(itemRD$: Observable<RemoteData<Item>>, uuids: string[]) {
    return itemRD$.pipe(
      getSucceededRemoteData(),
      map((itemRD: RemoteData<Item>) => itemRD.payload),
      map((item: Item) => uuids.includes(item.uuid))
    );
  }


  getRelationshipByItemsAndLabel(item1: Item, item2: Item, label: string): Observable<Relationship> {
    return this.getItemRelationshipsByLabel(item1, label)
      .pipe(
        mergeMap((relationships: Relationship[]) => {
          return observableCombineLatest(...relationships.map((relationship: Relationship) => {
            return observableCombineLatest(
              this.isItemMatchWithItemRD(relationship.leftItem, item2),
              this.isItemMatchWithItemRD(relationship.rightItem, item2)
            ).pipe(
              map(([isLeftItem, isRightItem]) => isLeftItem || isRightItem),
              map((isMatch) => isMatch ? relationship : undefined)
            );
          }))
        }),
        map((relationships: Relationship[]) => relationships.find((relationship => hasValue(relationship)))),
      )
  }

  private isItemMatchWithItemRD(itemRD$: Observable<RemoteData<Item>>, itemCheck: Item): Observable<boolean> {
    return itemRD$.pipe(
      getSucceededRemoteData(),
      map((itemRD: RemoteData<Item>) => itemRD.payload),
      map((item: Item) => item.uuid === itemCheck.uuid)
    );
  }

}
