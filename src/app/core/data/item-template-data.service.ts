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
class DataServiceImpl extends ItemDataService {

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

  findByCollectionID(collectionID: string): Observable<RemoteData<Item>> {
    this.collectionID = collectionID;
    return super.findById('961e137c-d815-4ade-aff1-0bb12f1fe965');
  }

  create(item: Item, collectionID: string): Observable<RemoteData<Item>> {
    this.collectionID = collectionID;
    return super.create(item);
  }

  deleteByCollectionID(item: Item, collectionID: string): Observable<boolean> {
    this.collectionID = collectionID;
    return super.delete(item);
  }
}

@Injectable()
export class ItemTemplateDataService implements UpdateDataService<Item> {
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

  commitUpdates(method?: RestRequestMethod) {
    this.dataService.commitUpdates(method);
  }

  update(object: Item): Observable<RemoteData<Item>> {
    return this.dataService.update(object);
  }

  findByCollectionID(collectionID: string): Observable<RemoteData<Item>> {
    return this.dataService.findByCollectionID(collectionID);
  }

  create(item: Item, collectionID: string): Observable<RemoteData<Item>> {
    return this.dataService.create(item, collectionID);
  }

  deleteByCollectionID(item: Item, collectionID: string): Observable<boolean> {
    return this.dataService.deleteByCollectionID(item, collectionID);
  }
}
