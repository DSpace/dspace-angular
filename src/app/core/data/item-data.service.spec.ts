import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { Observable, of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { BrowseService } from '../browse/browse.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { RestResponse } from '../cache/response.models';
import { CoreState } from '../core.reducers';
import { ExternalSourceEntry } from '../shared/external-source-entry.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ItemDataService } from './item-data.service';
import { DeleteRequest, FindListOptions, PostRequest, RestRequest } from './request.models';
import { RequestEntry } from './request.reducer';
import { RequestService } from './request.service';

describe('ItemDataService', () => {
  let scheduler: TestScheduler;
  let service: ItemDataService;
  let bs: BrowseService;
  const requestService = Object.assign(getMockRequestService(), {
    generateRequestId(): string {
      return scopeID;
    },
    configure(request: RestRequest) {
      // Do nothing
    },
    getByHref(requestHref: string) {
      const responseCacheEntry = new RequestEntry();
      responseCacheEntry.response = new RestResponse(true, 200, 'OK');
      return observableOf(responseCacheEntry);
    },
    removeByHrefSubstring(href: string) {
      // Do nothing
    }
  }) as RequestService;
  const rdbService = jasmine.createSpyObj('rdbService', {
    toRemoteDataObservable: observableOf({})
  });

  const store = {} as Store<CoreState>;
  const objectCache = {} as ObjectCacheService;
  const halEndpointService = {
    getEndpoint(linkPath: string): Observable<string> {
      return cold('a', { a: itemEndpoint });
    }
  } as HALEndpointService;
  const bundleService = jasmine.createSpyObj('bundleService', {
    findByHref: {}
  });

  const scopeID = '4af28e99-6a9c-4036-a199-e1b587046d39';
  const options = Object.assign(new FindListOptions(), {
    scopeID: scopeID,
    sort: {
      field: '',
      direction: undefined
    }
  });

  const browsesEndpoint = 'https://rest.api/discover/browses';
  const itemBrowseEndpoint = `${browsesEndpoint}/author/items`;
  const scopedEndpoint = `${itemBrowseEndpoint}?scope=${scopeID}`;
  const serviceEndpoint = `https://rest.api/core/items`;
  const browseError = new Error('getBrowseURL failed');
  const notificationsService = {} as NotificationsService;
  const http = {} as HttpClient;
  const comparator = {} as any;
  const itemEndpoint = 'https://rest.api/core/items';
  const ScopedItemEndpoint = `https://rest.api/core/items/${scopeID}`;

  function initMockBrowseService(isSuccessful: boolean) {
    const obs = isSuccessful ?
      cold('--a-', { a: itemBrowseEndpoint }) :
      cold('--#-', undefined, browseError);
    return jasmine.createSpyObj('bs', {
      getBrowseURLFor: obs
    });
  }

  function initTestService() {
    return new ItemDataService(
      requestService,
      rdbService,
      store,
      bs,
      objectCache,
      halEndpointService,
      notificationsService,
      http,
      comparator,
      bundleService
    );
  }

  describe('getBrowseEndpoint', () => {
    beforeEach(() => {
      scheduler = getTestScheduler();
    });

    it('should return the endpoint to fetch Items within the given scope and starting with the given string', () => {
      bs = initMockBrowseService(true);
      service = initTestService();

      const result = service.getBrowseEndpoint(options);
      const expected = cold('--b-', { b: scopedEndpoint });

      expect(result).toBeObservable(expected);
    });

    describe('if the dc.date.issue browse isn\'t configured for items', () => {
      beforeEach(() => {
        bs = initMockBrowseService(false);
        service = initTestService();
      });
      it('should throw an error', () => {
        const result = service.getBrowseEndpoint(options);
        const expected = cold('--#-', undefined, browseError);

        expect(result).toBeObservable(expected);
      });
    });
  });

  describe('getItemWithdrawEndpoint', () => {
    beforeEach(() => {
      scheduler = getTestScheduler();
      service = initTestService();

    });

    it('should return the endpoint to withdraw and reinstate items', () => {
      const result = service.getItemWithdrawEndpoint(scopeID);
      const expected = cold('a', { a: ScopedItemEndpoint });

      expect(result).toBeObservable(expected);
    });

    it('should setWithDrawn', () => {
      const expected = new RestResponse(true, 200, 'OK');
      const result = service.setWithDrawn(scopeID, true);
      result.subscribe((v) => expect(v).toEqual(expected));

    });
  });

  describe('getItemDiscoverableEndpoint', () => {
    beforeEach(() => {
      scheduler = getTestScheduler();
      service = initTestService();

    });

    it('should return the endpoint to make an item private or public', () => {
      const result = service.getItemDiscoverableEndpoint(scopeID);
      const expected = cold('a', { a: ScopedItemEndpoint });

      expect(result).toBeObservable(expected);
    });

    it('should setDiscoverable', () => {
      const expected = new RestResponse(true, 200, 'OK');
      const result = service.setDiscoverable(scopeID, false);
      result.subscribe((v) => expect(v).toEqual(expected));

    });
  });

  describe('removeMappingFromCollection', () => {
    let result;

    beforeEach(() => {
      service = initTestService();
      spyOn(requestService, 'configure');
      result = service.removeMappingFromCollection('item-id', 'collection-id');
    });

    it('should configure a DELETE request', () => {
      result.subscribe(() => expect(requestService.configure).toHaveBeenCalledWith(jasmine.any(DeleteRequest)));
    });
  });

  describe('mapToCollection', () => {
    let result;

    beforeEach(() => {
      service = initTestService();
      spyOn(requestService, 'configure');
      result = service.mapToCollection('item-id', 'collection-href');
    });

    it('should configure a POST request', () => {
      result.subscribe(() => expect(requestService.configure).toHaveBeenCalledWith(jasmine.any(PostRequest)));
    });
  });

  describe('importExternalSourceEntry', () => {
    let result;

    const externalSourceEntry = Object.assign(new ExternalSourceEntry(), {
      display: 'John, Doe',
      value: 'John, Doe',
      _links: { self: { href: 'http://test-rest.com/server/api/integration/externalSources/orcidV2/entryValues/0000-0003-4851-8004' } }
    });

    beforeEach(() => {
      service = initTestService();
      spyOn(requestService, 'configure');
      result = service.importExternalSourceEntry(externalSourceEntry, 'collection-id');
    });

    it('should configure a POST request', () => {
      result.subscribe(() => expect(requestService.configure).toHaveBeenCalledWith(jasmine.any(PostRequest)));
    });
  });

  describe('createBundle', () => {
    const itemId = '3de6ea60-ec39-419b-ae6f-065930ac1429';
    const bundleName = 'ORIGINAL';
    let result;

    beforeEach(() => {
      service = initTestService();
      spyOn(requestService, 'configure');
      result = service.createBundle(itemId, bundleName);
    });

    it('should configure a POST request', () => {
      result.subscribe(() => expect(requestService.configure).toHaveBeenCalledWith(jasmine.any(PostRequest)));
    });
  });

});
