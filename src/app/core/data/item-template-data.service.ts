import { Injectable } from '@angular/core';
import { ItemDataService } from './item-data.service';
import { UpdateDataService } from './update-data.service';
import { Item } from '../shared/item.model';
import { RestRequestMethod } from './rest-request-method';
import { RemoteData } from './remote-data';
import { Observable } from 'rxjs/internal/Observable';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { BrowseService } from '../browse/browse.service';
import { CollectionDataService } from './collection-data.service';
import { switchMap } from 'rxjs/operators';

/* tslint:disable:max-classes-per-file */
/**
 * A custom implementation of the ItemDataService, but for collection item templates
 * Makes sure to change the endpoint before sending out CRUD requests for the item template
 */
class DataServiceImpl extends ItemDataService {
  protected linkPath = 'itemtemplate';

  /**
   * The ID of the collection we're currently sending requests for
   */
  private collectionID: string;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected dataBuildService: NormalizedObjectBuildService,
    protected store: Store<CoreState>,
    protected bs: BrowseService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<Item>,
    protected collectionService: CollectionDataService) {
    super(requestService, rdbService, dataBuildService, store, bs, objectCache, halService, notificationsService, http, comparator);
  }

  /**
   * Get the base endpoint for all requests
   * Uses the current collectionID to assemble a request endpoint for the collection's item template
   */
  protected getEndpoint(): Observable<string> {
    return this.collectionService.getIDHrefObs(this.collectionID).pipe(
      switchMap((href: string) => this.halService.getEndpoint(this.linkPath, href))
    );
  }

  /**
   * Since the collection ID is included in the base endpoint, simply return the base endpoint
   * @param resourceID
   */
  getIDHrefObs(resourceID: string): Observable<string> {
    return this.getEndpoint();
  }

  /**
   * Set the collection ID and send a find by ID request
   * @param collectionID
   */
  findByCollectionID(collectionID: string): Observable<RemoteData<Item>> {
    this.collectionID = collectionID;
    return super.findById(collectionID);
  }

  /**
   * Set the collection ID and send a create request
   * @param item
   * @param collectionID
   */
  create(item: Item, collectionID: string): Observable<RemoteData<Item>> {
    this.collectionID = collectionID;
    return super.create(item);
  }

  /**
   * Set the collection ID and send a delete request
   * @param item
   * @param collectionID
   */
  deleteByCollectionID(item: Item, collectionID: string): Observable<boolean> {
    this.collectionID = collectionID;
    return super.delete(item);
  }
}

/**
 * A service responsible for fetching/sending data from/to the REST API on a collection's itemtemplate endpoint
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
    protected dataBuildService: NormalizedObjectBuildService,
    protected store: Store<CoreState>,
    protected bs: BrowseService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<Item>,
    protected collectionService: CollectionDataService) {
    this.dataService = new DataServiceImpl(requestService, rdbService, dataBuildService, store, bs, objectCache, halService, notificationsService, http, comparator, collectionService);
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

  /**
   * Find an item template by collection ID
   * @param collectionID
   */
  findByCollectionID(collectionID: string): Observable<RemoteData<Item>> {
    return this.dataService.findByCollectionID(collectionID);
  }

  /**
   * Create a new item template for a collection by ID
   * @param item
   * @param collectionID
   */
  create(item: Item, collectionID: string): Observable<RemoteData<Item>> {
    return this.dataService.create(item, collectionID);
  }

  /**
   * Delete a template item by collection ID
   * @param item
   * @param collectionID
   */
  deleteByCollectionID(item: Item, collectionID: string): Observable<boolean> {
    return this.dataService.deleteByCollectionID(item, collectionID);
  }
}
