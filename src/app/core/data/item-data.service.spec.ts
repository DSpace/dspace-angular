import {Store} from '@ngrx/store';
import {cold, getTestScheduler} from 'jasmine-marbles';
import {TestScheduler} from 'rxjs/testing';
import {BrowseService} from '../browse/browse.service';
import {RemoteDataBuildService} from '../cache/builders/remote-data-build.service';
import {ResponseCacheService} from '../cache/response-cache.service';
import {CoreState} from '../core.reducers';
import {ItemDataService} from './item-data.service';
import {RequestService} from './request.service';
import {HALEndpointService} from '../shared/hal-endpoint.service';
import {FindAllOptions, RestRequest} from './request.models';
import {Observable, of as observableOf} from 'rxjs';
import {ResponseCacheEntry} from '../cache/response-cache.reducer';
import {RestResponse} from '../cache/response-cache.models';

describe('ItemDataService', () => {
  let scheduler: TestScheduler;
  let service: ItemDataService;
  let bs: BrowseService;
  const requestService = {
    generateRequestId(): string {
      return scopeID;
    },
    configure(request: RestRequest) {
      // Do nothing
    }
  } as RequestService;
  const responseCache = {
    get(href: string) {
      const responseCacheEntry = new ResponseCacheEntry();
      responseCacheEntry.response = new RestResponse(true, '200');
      return observableOf(responseCacheEntry);
    }
  } as ResponseCacheService;
  const rdbService = {} as RemoteDataBuildService;
  const store = {} as Store<CoreState>;
  const halEndpointService = {
    getEndpoint(linkPath: string): Observable<string> {
      return cold('a', {a: itemEndpoint});
    }
  } as HALEndpointService;

  const scopeID = '4af28e99-6a9c-4036-a199-e1b587046d39';
  const options = Object.assign(new FindAllOptions(), {
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
  const itemEndpoint = 'https://rest.api/core/items';
  const ScopedItemEndpoint = `https://rest.api/core/items/${scopeID}`;

  function initMockBrowseService(isSuccessful: boolean) {
    const obs = isSuccessful ?
      cold('--a-', {a: itemBrowseEndpoint}) :
      cold('--#-', undefined, browseError);
    return jasmine.createSpyObj('bs', {
      getBrowseURLFor: obs
    });
  }

  function initTestService() {
    return new ItemDataService(
      responseCache,
      requestService,
      rdbService,
      store,
      bs,
      halEndpointService
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
      const expected = cold('--b-', {b: scopedEndpoint});

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
      const expected = cold('a', {a: ScopedItemEndpoint});

      expect(result).toBeObservable(expected);
    });

    it('should setWithDrawn', () => {
      const expected = new RestResponse(true, '200');
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
      const expected = cold('a', {a: ScopedItemEndpoint});

      expect(result).toBeObservable(expected);
    });

    it('should setDiscoverable', () => {
      const expected = new RestResponse(true, '200');
      const result = service.setDiscoverable(scopeID, false);
      result.subscribe((v) => expect(v).toEqual(expected));

    });
  });

  describe('getItemDeleteEndpoint', () => {
    beforeEach(() => {
      scheduler = getTestScheduler();
      service = initTestService();
    });

    it('should return the endpoint to make an item private or public', () => {
      const result = service.getItemDeleteEndpoint(scopeID);
      const expected = cold('a', {a: ScopedItemEndpoint});

      expect(result).toBeObservable(expected);
    });

    it('should delete the item', () => {
      const expected = new RestResponse(true, '200');
      const result = service.delete(scopeID);
      result.subscribe((v) => expect(v).toEqual(expected));

    });
  });

});
