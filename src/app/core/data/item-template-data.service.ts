/* eslint-disable max-classes-per-file */
import { Injectable } from '@angular/core';
import { ItemDataService } from './item-data.service';
import { UpdateDataService } from './update-data.service';
import { Item } from '../shared/item.model';
import { RestRequestMethod } from './rest-request-method';
import { RemoteData } from './remote-data';
import { Observable } from 'rxjs';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { BrowseService } from '../browse/browse.service';
import { CollectionDataService } from './collection-data.service';
import { map, switchMap } from 'rxjs/operators';
import { BundleDataService } from './bundle-data.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { NoContent } from '../shared/NoContent.model';
import { hasValue } from '../../shared/empty.util';
import { Operation } from 'fast-json-patch';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { CoreState } from '../core-state.model';

/**
 * A custom implementation of the ItemDataService, but for collection item templates
 * Makes sure to change the endpoint before sending out CRUD requests for the item template
 */
class DataServiceImpl extends ItemDataService {
  protected collectionLinkPath = 'itemtemplate';
  protected linkPath = 'itemtemplates';

  /**
   * Endpoint dynamically changing depending on what request we're sending
   */
  private endpoint$: Observable<string>;

  /**
   * Is the current endpoint based on a collection?
   */
  private collectionEndpoint = false;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected bs: BrowseService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<Item>,
    protected bundleService: BundleDataService,
    protected collectionService: CollectionDataService) {
    super(requestService, rdbService, store, bs, objectCache, halService, notificationsService, http, comparator, bundleService);
  }

  /**
   * Get the endpoint based on a collection
   * @param collectionID  The ID of the collection to base the endpoint on
   */
  public getCollectionEndpoint(collectionID: string): Observable<string> {
    return this.collectionService.getIDHrefObs(collectionID).pipe(
      switchMap((href: string) => this.halService.getEndpoint(this.collectionLinkPath, href))
    );
  }

  /**
   * Set the endpoint to be based on a collection
   * @param collectionID  The ID of the collection to base the endpoint on
   */
  private setCollectionEndpoint(collectionID: string) {
    this.collectionEndpoint = true;
    this.endpoint$ = this.getCollectionEndpoint(collectionID);
  }

  /**
   * Set the endpoint to the regular linkPath
   */
  private setRegularEndpoint() {
    this.collectionEndpoint = false;
    this.endpoint$ = this.halService.getEndpoint(this.linkPath);
  }

  /**
   * Get the base endpoint for all requests
   * Uses the current collectionID to assemble a request endpoint for the collection's item template
   */
  protected getEndpoint(): Observable<string> {
    return this.endpoint$;
  }

  /**
   * If the current endpoint is based on a collection, simply return the collection's template endpoint, otherwise
   * create a regular template endpoint
   * @param resourceID
   */
  getIDHrefObs(resourceID: string): Observable<string> {
    if (this.collectionEndpoint) {
      return this.getEndpoint();
    } else {
      return super.getIDHrefObs(resourceID);
    }
  }

  /**
   * Set the collection ID and send a find by ID request
   * @param collectionID
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  findByCollectionID(collectionID: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Item>[]): Observable<RemoteData<Item>> {
    this.setCollectionEndpoint(collectionID);
    return super.findById(collectionID, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Set the collection ID and send a create request
   * @param item
   * @param collectionID
   */
  createTemplate(item: Item, collectionID: string): Observable<RemoteData<Item>> {
    this.setCollectionEndpoint(collectionID);
    return super.create(item);
  }

  /**
   * Set the collection ID and send a delete request
   * @param item
   * @param collectionID
   */
  deleteByCollectionID(item: Item, collectionID: string): Observable<boolean> {
    this.setRegularEndpoint();
    return super.delete(item.uuid).pipe(
      getFirstCompletedRemoteData(),
      map((response: RemoteData<NoContent>) => hasValue(response) && response.hasSucceeded)
    );
  }
}

/**
 * A service responsible for fetching/sending data from/to the REST API on a collection's itemtemplates endpoint
 */
@Injectable()
export class ItemTemplateDataService implements UpdateDataService<Item> {
  /**
   * The data service responsible for all CRUD actions on the item
   */
  private dataService: DataServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected bs: BrowseService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<Item>,
    protected bundleService: BundleDataService,
    protected collectionService: CollectionDataService) {
    this.dataService = new DataServiceImpl(requestService, rdbService, store, bs, objectCache, halService, notificationsService, http, comparator, bundleService, collectionService);
  }

  /**
   * Commit current object changes to the server
   */
  commitUpdates(method?: RestRequestMethod) {
    this.dataService.commitUpdates(method);
  }

  /**
   * Add a new patch to the object cache
   */
  update(object: Item): Observable<RemoteData<Item>> {
    return this.dataService.update(object);
  }

  patch(dso: Item, operations: Operation[]): Observable<RemoteData<Item>> {
    return this.dataService.patch(dso, operations);
  }

  /**
   * Find an item template by collection ID
   * @param collectionID
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  findByCollectionID(collectionID: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Item>[]): Observable<RemoteData<Item>> {
    return this.dataService.findByCollectionID(collectionID, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Create a new item template for a collection by ID
   * @param item
   * @param collectionID
   */
  create(item: Item, collectionID: string): Observable<RemoteData<Item>> {
    return this.dataService.createTemplate(item, collectionID);
  }

  /**
   * Delete a template item by collection ID
   * @param item
   * @param collectionID
   */
  deleteByCollectionID(item: Item, collectionID: string): Observable<boolean> {
    return this.dataService.deleteByCollectionID(item, collectionID);
  }

  /**
   * Get the endpoint based on a collection
   * @param collectionID  The ID of the collection to base the endpoint on
   */
  getCollectionEndpoint(collectionID: string): Observable<string> {
    return this.dataService.getCollectionEndpoint(collectionID);
  }
}
