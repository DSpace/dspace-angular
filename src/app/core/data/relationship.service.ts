import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MemoizedSelector, select, Store } from '@ngrx/store';
import { combineLatest, combineLatest as observableCombineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, startWith, switchMap, take, tap } from 'rxjs/operators';
import { compareArraysUsingIds, paginatedRelationsToItems, relationsToItems } from '../../+item-page/simple/item-types/shared/item-relationships-utils';
import { AppState, keySelector } from '../../app.reducer';
import { hasValue, hasValueOperator, isNotEmpty, isNotEmptyOperator } from '../../shared/empty.util';
import { ReorderableRelationship } from '../../shared/form/builder/ds-dynamic-form-ui/existing-metadata-list-element/existing-metadata-list-element.component';
import { RemoveNameVariantAction, SetNameVariantAction } from '../../shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/name-variant.actions';
import { NameVariantListState } from '../../shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/name-variant.reducer';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { configureRequest, getRemoteDataPayload, getResponseFromEntry, getSucceededRemoteData } from '../shared/operators';
import { SearchParam } from '../cache/models/search-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DeleteRequest, FindListOptions, PostRequest, RestRequest } from './request.models';
import { RestResponse } from '../cache/response.models';
import { CoreState } from '../core.reducers';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RelationshipType } from '../shared/item-relationships/relationship-type.model';
import { RemoteData, RemoteDataState } from './remote-data';
import { PaginatedList } from './paginated-list';
import { ItemDataService } from './item-data.service';
import { Relationship } from '../shared/item-relationships/relationship.model';
import { Item } from '../shared/item.model';
import { DataService } from './data.service';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { RequestService } from './request.service';
import { Observable } from 'rxjs/internal/Observable';

const relationshipListsStateSelector = (state: AppState) => state.relationshipLists;

const relationshipListStateSelector = (listID: string): MemoizedSelector<AppState, NameVariantListState> => {
  return keySelector<NameVariantListState>(listID, relationshipListsStateSelector);
};

const relationshipStateSelector = (listID: string, itemID: string): MemoizedSelector<AppState, string> => {
  return keySelector<string>(itemID, relationshipListStateSelector(listID));
};

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
              protected comparator: DefaultChangeAnalyzer<Relationship>,
              protected appStore: Store<AppState>) {
    super();
  }

  getBrowseEndpoint(options: FindListOptions = {}, linkPath: string = this.linkPath): Observable<string> {
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
      take(1),
      map((endpointURL: string) => new DeleteRequest(this.requestService.generateRequestId(), endpointURL)),
      configureRequest(this.requestService),
      switchMap((restRequest: RestRequest) => this.requestService.getByUUID(restRequest.uuid)),
      getResponseFromEntry(),
      tap(() => this.removeRelationshipItemsFromCacheByRelationship(id))
    );
  }

  /**
   * Method to create a new relationship
   * @param typeId The identifier of the relationship type
   * @param item1 The first item of the relationship
   * @param item2 The second item of the relationship
   * @param leftwardValue The leftward value of the relationship
   * @param rightwardValue The rightward value of the relationship
   */
  addRelationship(typeId: string, item1: Item, item2: Item, leftwardValue?: string, rightwardValue?: string): Observable<RestResponse> {
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/uri-list');
    options.headers = headers;
    return this.halService.getEndpoint(this.linkPath).pipe(
      isNotEmptyOperator(),
      take(1),
      map((endpointUrl: string) => `${endpointUrl}?relationshipType=${typeId}`),
      map((endpointUrl: string) => isNotEmpty(leftwardValue) ? `${endpointUrl}&leftwardValue=${leftwardValue}` : endpointUrl),
      map((endpointUrl: string) => isNotEmpty(rightwardValue) ? `${endpointUrl}&rightwardValue=${rightwardValue}` : endpointUrl),
      map((endpointURL: string) => new PostRequest(this.requestService.generateRequestId(), endpointURL, `${item1.self} \n ${item2.self}`, options)),
      configureRequest(this.requestService),
      switchMap((restRequest: RestRequest) => this.requestService.getByUUID(restRequest.uuid)),
      getResponseFromEntry(),
      tap(() => this.removeRelationshipItemsFromCache(item1)),
      tap(() => this.removeRelationshipItemsFromCache(item2))
    ) as Observable<RestResponse>;
  }

  /**
   * Method to remove two items of a relationship from the cache using the identifier of the relationship
   * @param relationshipId The identifier of the relationship
   */
  private removeRelationshipItemsFromCacheByRelationship(relationshipId: string) {
    this.findById(relationshipId).pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      switchMap((rel: Relationship) => combineLatest(
        rel.leftItem.pipe(getSucceededRemoteData(), getRemoteDataPayload()),
        rel.rightItem.pipe(getSucceededRemoteData(), getRemoteDataPayload())
        )
      ),
      take(1)
    ).subscribe(([item1, item2]) => {
      this.removeRelationshipItemsFromCache(item1);
      this.removeRelationshipItemsFromCache(item2);
    })
  }

  /**
   * Method to remove an item that's part of a relationship from the cache
   * @param item The item to remove from the cache
   */
  private removeRelationshipItemsFromCache(item) {
    this.objectCache.remove(item.self);
    this.requestService.removeByHrefSubstring(item.uuid);
    combineLatest(
      this.objectCache.hasBySelfLinkObservable(item.self),
      this.requestService.hasByHrefObservable(item.uuid)
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
          if (otherItem.uuid === item.uuid) {
            return relationshipType.leftwardType;
          } else {
            return relationshipType.rightwardType;
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
   * @param options
   */
  getRelatedItemsByLabel(item: Item, label: string, options?: FindListOptions): Observable<RemoteData<PaginatedList<Item>>> {
    return this.getItemRelationshipsByLabel(item, label, options).pipe(paginatedRelationsToItems(item.uuid));
  }

  /**
   * Resolve a given item's relationships into related items, filtered by a relationship label
   * and return the items as an array
   * @param item
   * @param label
   * @param options
   */
  getItemRelationshipsByLabel(item: Item, label: string, options?: FindListOptions): Observable<RemoteData<PaginatedList<Relationship>>> {
    let findListOptions = new FindListOptions();
    if (options) {
      findListOptions = Object.assign(new FindListOptions(), options);
    }
    const searchParams = [new SearchParam('label', label), new SearchParam('dso', item.id)];
    if (findListOptions.searchParams) {
      findListOptions.searchParams = [...findListOptions.searchParams, ...searchParams];
    } else {
      findListOptions.searchParams = searchParams;
    }
    return this.searchBy('byLabel', findListOptions);
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
      map((relationships: Relationship[]) => relationships.filter(((relationship) => hasValue(relationship)))),
    )
  }

  private isItemInUUIDArray(itemRD$: Observable<RemoteData<Item>>, uuids: string[]) {
    return itemRD$.pipe(
      getSucceededRemoteData(),
      map((itemRD: RemoteData<Item>) => itemRD.payload),
      map((item: Item) => uuids.includes(item.uuid))
    );
  }

  /**
   * Method to retrieve a relationship based on two items and a relationship type label
   * @param item1 The first item in the relationship
   * @param item2 The second item in the relationship
   * @param label The rightward or leftward type of the relationship
   */
  getRelationshipByItemsAndLabel(item1: Item, item2: Item, label: string): Observable<Relationship> {
    return this.getItemRelationshipsByLabel(item1, label)
      .pipe(
        getSucceededRemoteData(),
        isNotEmptyOperator(),
        map((relationshipListRD: RemoteData<PaginatedList<Relationship>>) => relationshipListRD.payload.page),
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
        map((relationships: Relationship[]) => relationships.find(((relationship) => hasValue(relationship))))
      )
  }

  private isItemMatchWithItemRD(itemRD$: Observable<RemoteData<Item>>, itemCheck: Item): Observable<boolean> {
    return itemRD$.pipe(
      getSucceededRemoteData(),
      map((itemRD: RemoteData<Item>) => itemRD.payload),
      map((item: Item) => item.uuid === itemCheck.uuid)
    );
  }

  /**
   * Method to set the name variant for specific list and item
   * @param listID The list for which to save the name variant
   * @param itemID The item ID for which to save the name variant
   * @param nameVariant The name variant to save
   */
  public setNameVariant(listID: string, itemID: string, nameVariant: string) {
    this.appStore.dispatch(new SetNameVariantAction(listID, itemID, nameVariant));
  }

  /**
   * Method to retrieve the name variant for a specific list and item
   * @param listID The list for which to retrieve the name variant
   * @param itemID The item ID for which to retrieve the name variant
   */
  public getNameVariant(listID: string, itemID: string): Observable<string> {
    return this.appStore.pipe(
      select(relationshipStateSelector(listID, itemID))
    );
  }

  /**
   * Method to remove the name variant for specific list and item
   * @param listID The list for which to remove the name variant
   * @param itemID The item ID for which to remove the name variant
   */
  public removeNameVariant(listID: string, itemID: string) {
    this.appStore.dispatch(new RemoveNameVariantAction(listID, itemID));
  }

  /**
   * Method to retrieve all name variants for a single list
   * @param listID The id of the list
   */
  public getNameVariantsByListID(listID: string) {
    return this.appStore.pipe(select(relationshipListStateSelector(listID)));
  }

  /**
   * Method to update the name variant on the server
   * @param item1 The first item of the relationship
   * @param item2 The second item of the relationship
   * @param relationshipLabel The leftward or rightward type of the relationship
   * @param nameVariant The name variant to set for the matching relationship
   */
  public updateNameVariant(item1: Item, item2: Item, relationshipLabel: string, nameVariant: string): Observable<RemoteData<Relationship>> {
    const update$: Observable<RemoteData<Relationship>> = this.getRelationshipByItemsAndLabel(item1, item2, relationshipLabel)
      .pipe(
        switchMap((relation: Relationship) =>
          relation.relationshipType.pipe(
            getSucceededRemoteData(),
            getRemoteDataPayload(),
            map((type) => {
              return { relation, type }
            })
          )
        ),
        switchMap((relationshipAndType: { relation: Relationship, type: RelationshipType }) => {
          const { relation, type } = relationshipAndType;
          let updatedRelationship;
          if (relationshipLabel === type.leftwardType) {
            updatedRelationship = Object.assign(new Relationship(), relation, { rightwardValue: nameVariant });
          } else {
            updatedRelationship = Object.assign(new Relationship(), relation, { leftwardValue: nameVariant });
          }
          return this.update(updatedRelationship);
        }),
      );

    update$.pipe(
      filter((relationshipRD: RemoteData<Relationship>) => relationshipRD.state === RemoteDataState.RequestPending),
      take(1),
    ).subscribe(() => {
      this.removeRelationshipItemsFromCache(item1);
      this.removeRelationshipItemsFromCache(item2);
    });

    return update$
  }

  /**
   * Method to update the the right or left place of a relationship
   * The useLeftItem field in the reorderable relationship determines which place should be updated
   * @param reoRel
   */
  public updatePlace(reoRel: ReorderableRelationship): Observable<RemoteData<Relationship>> {
    let updatedRelationship;
    if (reoRel.useLeftItem) {
      updatedRelationship = Object.assign(new Relationship(), reoRel.relationship, { rightPlace: reoRel.newIndex });
    } else {
      updatedRelationship = Object.assign(new Relationship(), reoRel.relationship, { leftPlace: reoRel.newIndex });
    }

    const update$ = this.update(updatedRelationship);

    update$.pipe(
      filter((relationshipRD: RemoteData<Relationship>) => relationshipRD.state === RemoteDataState.ResponsePending),
      take(1),
    ).subscribe((relationshipRD: RemoteData<Relationship>) => {
      if (relationshipRD.state === RemoteDataState.ResponsePending) {
        this.removeRelationshipItemsFromCacheByRelationship(reoRel.relationship.id);
      }
    });

    return update$;
  }

}
