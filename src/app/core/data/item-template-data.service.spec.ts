import { ItemTemplateDataService } from './item-template-data.service';
import { RestResponse } from '../cache/response.models';
import { RequestService } from './request.service';
import { Observable, of as observableOf } from 'rxjs';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { BrowseService } from '../browse/browse.service';
import { cold } from 'jasmine-marbles';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { CollectionDataService } from './collection-data.service';
import { RestRequestMethod } from './rest-request-method';
import { Item } from '../shared/item.model';
import { RestRequest } from './rest-request.model';
import { CoreState } from '../core-state.model';
import { RequestEntry } from './request-entry.model';

describe('ItemTemplateDataService', () => {
  let service: ItemTemplateDataService;
  let itemService: any;

  const item = new Item();
  const collectionEndpoint = 'https://rest.api/core/collections/4af28e99-6a9c-4036-a199-e1b587046d39';
  const itemEndpoint = `${collectionEndpoint}/itemtemplate`;
  const scopeID = '4af28e99-6a9c-4036-a199-e1b587046d39';
  const requestService = {
    generateRequestId(): string {
      return scopeID;
    },
    send(request: RestRequest) {
      // Do nothing
    },
    getByHref(requestHref: string) {
      const responseCacheEntry = new RequestEntry();
      responseCacheEntry.response = new RestResponse(true, 200, 'OK');
      return observableOf(responseCacheEntry);
    },
    getByUUID(uuid: string) {
      const responseCacheEntry = new RequestEntry();
      responseCacheEntry.response = new RestResponse(true, 200, 'OK');
      return observableOf(responseCacheEntry);
    },
    commit(method?: RestRequestMethod) {
      // Do nothing
    }
  } as RequestService;
  const rdbService = {} as RemoteDataBuildService;
  const store = {} as Store<CoreState>;
  const bs = {} as BrowseService;
  const objectCache = {
    getObjectBySelfLink(self) {
      return observableOf({});
    },
    addPatch(self, operations) {
      // Do nothing
    }
  } as any;
  const halEndpointService = {
    getEndpoint(linkPath: string): Observable<string> {
      return cold('a', { a: itemEndpoint });
    }
  } as HALEndpointService;
  const notificationsService = {} as NotificationsService;
  const http = {} as HttpClient;
  const comparator = {
    diff(first, second) {
      return [{}];
    }
  } as any;
  const collectionService = {
    getIDHrefObs(id): Observable<string> {
      return observableOf(collectionEndpoint);
    }
  } as CollectionDataService;

  function initTestService() {
    service = new ItemTemplateDataService(
      requestService,
      rdbService,
      store,
      bs,
      objectCache,
      halEndpointService,
      notificationsService,
      http,
      comparator,
      undefined,
      collectionService
    );
    itemService = (service as any).dataService;
  }

  beforeEach(() => {
    initTestService();
  });

  describe('commitUpdates', () => {
    it('should call commitUpdates on the item service implementation', () => {
      spyOn(itemService, 'commitUpdates');
      service.commitUpdates();
      expect(itemService.commitUpdates).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should call update on the item service implementation', () => {
      spyOn(itemService, 'update');
      service.update(item);
      expect(itemService.update).toHaveBeenCalled();
    });
  });

  describe('findByCollectionID', () => {
    it('should call findByCollectionID on the item service implementation', () => {
      spyOn(itemService, 'findByCollectionID');
      service.findByCollectionID(scopeID);
      expect(itemService.findByCollectionID).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should call createTemplate on the item service implementation', () => {
      spyOn(itemService, 'createTemplate');
      service.create(item, scopeID);
      expect(itemService.createTemplate).toHaveBeenCalled();
    });
  });

  describe('deleteByCollectionID', () => {
    it('should call deleteByCollectionID on the item service implementation', () => {
      spyOn(itemService, 'deleteByCollectionID');
      service.deleteByCollectionID(item, scopeID);
      expect(itemService.deleteByCollectionID).toHaveBeenCalled();
    });
  });
});
