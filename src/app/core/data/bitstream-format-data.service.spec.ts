import { BitstreamFormatDataService } from './bitstream-format-data.service';
import { RequestEntry } from './request.reducer';
import { RestResponse } from '../cache/response.models';
import { Observable, of as observableOf } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { ObjectCacheService } from '../cache/object-cache.service';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { BitstreamFormat } from '../shared/bitstream-format.model';
import { async } from '@angular/core/testing';
import {
  BitstreamFormatsRegistryDeselectAction,
  BitstreamFormatsRegistryDeselectAllAction,
  BitstreamFormatsRegistrySelectAction
} from '../../+admin/admin-registries/bitstream-formats/bitstream-format.actions';
import { TestScheduler } from 'rxjs/testing';
import { CoreState } from '../core.reducers';

describe('BitstreamFormatDataService', () => {
  let service: BitstreamFormatDataService;
  let requestService;
  let scheduler: TestScheduler;

  const bitstreamFormatsEndpoint = 'https://rest.api/core/bitstream-formats';
  const bitstreamFormatsIdEndpoint = 'https://rest.api/core/bitstream-formats/format-id';

  const responseCacheEntry = new RequestEntry();
  responseCacheEntry.response = new RestResponse(true, 200, 'Success');
  responseCacheEntry.completed = true;

  const store = {
    dispatch(action: Action) {
      // Do Nothing
    }
  } as Store<CoreState>;

  const objectCache = {} as ObjectCacheService;
  const halEndpointService = {
    getEndpoint(linkPath: string): Observable<string> {
      return cold('a', {a: bitstreamFormatsEndpoint});
    }
  } as HALEndpointService;

  const notificationsService = {} as NotificationsService;
  const http = {} as HttpClient;
  const comparator = {} as any;
  const rdbService = {} as RemoteDataBuildService;

  function initTestService(halService) {
    return new BitstreamFormatDataService(
      requestService,
      rdbService,
      store,
      objectCache,
      halService,
      notificationsService,
      http,
      comparator
    );
  }

  describe('getBrowseEndpoint', () => {
    beforeEach(async(() => {
      scheduler = getTestScheduler();
      requestService = jasmine.createSpyObj('requestService', {
        configure: {},
        getByHref: observableOf(responseCacheEntry),
        getByUUID: cold('a', {a: responseCacheEntry}),
        generateRequestId: 'request-id',
        removeByHrefSubstring: {}
      });
      service = initTestService(halEndpointService);
    }));
    it('should get the browse endpoint', () => {
      const result = service.getBrowseEndpoint();
      const expected = cold('b', {b: bitstreamFormatsEndpoint});

      expect(result).toBeObservable(expected);
    });
  });

  describe('getUpdateEndpoint', () => {
    beforeEach(async(() => {
      scheduler = getTestScheduler();
      requestService = jasmine.createSpyObj('requestService', {
        configure: {},
        getByHref: observableOf(responseCacheEntry),
        getByUUID: cold('a', {a: responseCacheEntry}),
        generateRequestId: 'request-id',
        removeByHrefSubstring: {}
      });
      service = initTestService(halEndpointService);
    }));
    it('should get the update endpoint', () => {
      const formatId = 'format-id';

      const result = service.getUpdateEndpoint(formatId);
      const expected = cold('b', {b: bitstreamFormatsIdEndpoint});

      expect(result).toBeObservable(expected);
    });
  });

  describe('getCreateEndpoint', () => {
    beforeEach(async(() => {
      scheduler = getTestScheduler();
      requestService = jasmine.createSpyObj('requestService', {
        configure: {},
        getByHref: observableOf(responseCacheEntry),
        getByUUID: cold('a', {a: responseCacheEntry}),
        generateRequestId: 'request-id',
        removeByHrefSubstring: {}
      });
      service = initTestService(halEndpointService);
    }));
    it('should get the create endpoint ', () => {

      const result = service.getCreateEndpoint();
      const expected = cold('b', {b: bitstreamFormatsEndpoint});

      expect(result).toBeObservable(expected);
    });
  });

  describe('updateBitstreamFormat', () => {
    beforeEach(async(() => {
      scheduler = getTestScheduler();
      requestService = jasmine.createSpyObj('requestService', {
        configure: {},
        getByHref: observableOf(responseCacheEntry),
        getByUUID: cold('a', {a: responseCacheEntry}),
        generateRequestId: 'request-id',
        removeByHrefSubstring: {}
      });
      service = initTestService(halEndpointService);
    }));
    it('should update the bitstream format', () => {
      const updatedBistreamFormat = new BitstreamFormat();
      updatedBistreamFormat.uuid = 'updated-uuid';

      const expected = cold('(b)', {b: new RestResponse(true, 200, 'Success')});
      const result = service.updateBitstreamFormat(updatedBistreamFormat);

      expect(result).toBeObservable(expected);

    });
  });

  describe('createBitstreamFormat', () => {
    beforeEach(async(() => {
      scheduler = getTestScheduler();
      requestService = jasmine.createSpyObj('requestService', {
        configure: {},
        getByHref: observableOf(responseCacheEntry),
        getByUUID: cold('a', {a: responseCacheEntry}),
        generateRequestId: 'request-id',
        removeByHrefSubstring: {}
      });
      service = initTestService(halEndpointService);
    }));
    it('should create a new bitstream format', () => {
      const newFormat = new BitstreamFormat();
      newFormat.uuid = 'new-uuid';

      const expected = cold('(b)', {b: new RestResponse(true, 200, 'Success')});
      const result = service.createBitstreamFormat(newFormat);

      expect(result).toBeObservable(expected);
    });
  });

  describe('clearBitStreamFormatRequests', () => {
    beforeEach(async(() => {
      scheduler = getTestScheduler();
      requestService = jasmine.createSpyObj('requestService', {
        configure: {},
        getByHref: observableOf(responseCacheEntry),
        getByUUID: cold('a', {a: responseCacheEntry}),
        generateRequestId: 'request-id',
        removeByHrefSubstring: {}
      });
      const halService = {
        getEndpoint(linkPath: string): Observable<string> {
          return observableOf(bitstreamFormatsEndpoint);
        }
      } as HALEndpointService;
      service = initTestService(halService);
      service.clearBitStreamFormatRequests().subscribe();
    }));
    it('should remove the bitstream format hrefs in the request service', () => {
      expect(requestService.removeByHrefSubstring).toHaveBeenCalledWith(bitstreamFormatsEndpoint);
    });
  });

  describe('selectBitstreamFormat', () => {
    beforeEach(async(() => {
      scheduler = getTestScheduler();
      requestService = jasmine.createSpyObj('requestService', {
        configure: {},
        getByHref: observableOf(responseCacheEntry),
        getByUUID: cold('a', {a: responseCacheEntry}),
        generateRequestId: 'request-id',
        removeByHrefSubstring: {}
      });
      service = initTestService(halEndpointService);
      spyOn(store, 'dispatch');
    }));
    it('should add a selected bitstream to the store', () => {
      const format = new BitstreamFormat();
      format.uuid = 'uuid';

      service.selectBitstreamFormat(format);
      expect(store.dispatch).toHaveBeenCalledWith(new BitstreamFormatsRegistrySelectAction(format));
    });
  });

  describe('deselectBitstreamFormat', () => {
    beforeEach(async(() => {
      scheduler = getTestScheduler();
      requestService = jasmine.createSpyObj('requestService', {
        configure: {},
        getByHref: observableOf(responseCacheEntry),
        getByUUID: cold('a', {a: responseCacheEntry}),
        generateRequestId: 'request-id',
        removeByHrefSubstring: {}
      });
      service = initTestService(halEndpointService);
      spyOn(store, 'dispatch');
    }));
    it('should remove a bitstream from the store', () => {
      const format = new BitstreamFormat();
      format.uuid = 'uuid';

      service.deselectBitstreamFormat(format);
      expect(store.dispatch).toHaveBeenCalledWith(new BitstreamFormatsRegistryDeselectAction(format));
    });
  });

  describe('deselectAllBitstreamFormats', () => {
    beforeEach(async(() => {
      scheduler = getTestScheduler();
      requestService = jasmine.createSpyObj('requestService', {
        configure: {},
        getByHref: observableOf(responseCacheEntry),
        getByUUID: cold('a', {a: responseCacheEntry}),
        generateRequestId: 'request-id',
        removeByHrefSubstring: {}
      });
      service = initTestService(halEndpointService);
      spyOn(store, 'dispatch');

    }));
    it('should remove all bitstreamFormats from the store', () => {
      service.deselectAllBitstreamFormats();
      expect(store.dispatch).toHaveBeenCalledWith(new BitstreamFormatsRegistryDeselectAllAction());
    });
  });

  describe('delete', () => {
    beforeEach(async(() => {
      scheduler = getTestScheduler();
      requestService = jasmine.createSpyObj('requestService', {
        configure: {},
        getByHref: observableOf(responseCacheEntry),
        getByUUID: hot('a', {a: responseCacheEntry}),
        generateRequestId: 'request-id',
        removeByHrefSubstring: {}
      });
      const halService = {
        getEndpoint(linkPath: string): Observable<string> {
          return observableOf(bitstreamFormatsEndpoint);
        }
      } as HALEndpointService;
      service = initTestService(halService);
    }));
    it('should delete a bitstream format', () => {
      const format = new BitstreamFormat();
      format.uuid = 'format-uuid';
      format.id = 'format-id';

      const expected = cold('(b|)', {b: true});
      const result = service.delete(format);

      expect(result).toBeObservable(expected);
    });
  });
});
