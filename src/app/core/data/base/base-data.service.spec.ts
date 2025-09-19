/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
// eslint-disable-next-line max-classes-per-file
import {
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  combineLatest as observableCombineLatest,
  Observable,
  of,
} from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { getMockRemoteDataBuildService } from '../../../shared/mocks/remote-data-build.service.mock';
import { getMockRequestService } from '../../../shared/mocks/request.service.mock';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../../../shared/remote-data.utils';
import { HALEndpointServiceStub } from '../../../shared/testing/hal-endpoint-service.stub';
import { ObjectCacheServiceStub } from '../../../shared/testing/object-cache-service.stub';
import { createPaginatedList } from '../../../shared/testing/utils.test';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import {
  link,
  typedObject,
} from '../../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { ObjectCacheEntry } from '../../cache/object-cache.reducer';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { BITSTREAM } from '../../shared/bitstream.resource-type';
import { COLLECTION } from '../../shared/collection.resource-type';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { HALLink } from '../../shared/hal-link.model';
import { ResourceType } from '../../shared/resource-type';
import { FindListOptions } from '../find-list-options.model';
import { PaginatedList } from '../paginated-list.model';
import { RemoteData } from '../remote-data';
import { RequestService } from '../request.service';
import { RequestEntryState } from '../request-entry-state.model';
import { BaseDataService } from './base-data.service';

const endpoint = 'https://rest.api/core';

const BOOLEAN = { f: false, t: true };

class TestService extends BaseDataService<any> {
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super(undefined, requestService, rdbService, objectCache, halService);
  }

  public getBrowseEndpoint(options: FindListOptions = {}, linkPath: string = this.linkPath): Observable<string> {
    return of(endpoint);
  }
}

@typedObject
class BaseData {
  static type = new ResourceType('test');

  foo: string;

  _links: {
    followLink1: HALLink;
    followLink2: HALLink[];
    self: HALLink;
  };

  @link(COLLECTION)
  followLink1: Observable<any>;

  @link(BITSTREAM, true, 'followLink2')
  followLink2CustomVariableName: Observable<PaginatedList<any>>;
}

describe('BaseDataService', () => {
  let service: TestService;
  let requestService;
  let halService;
  let rdbService;
  let objectCache: ObjectCacheServiceStub;
  let selfLink;
  let linksToFollow;
  let testScheduler;
  let remoteDataTimestamp: number;
  let remoteDataMocks: { [responseType: string]: RemoteData<BaseData> };
  let remoteDataPageMocks: { [responseType: string]: RemoteData<PaginatedList<BaseData>> };

  function initTestService(): TestService {
    requestService = getMockRequestService();
    halService = new HALEndpointServiceStub('url') as any;
    rdbService = getMockRemoteDataBuildService();
    objectCache = new ObjectCacheServiceStub();
    selfLink = 'https://rest.api/endpoint/1698f1d3-be98-4c51-9fd8-6bfedcbd59b7';
    linksToFollow = [
      followLink('a'),
      followLink('b'),
    ];

    testScheduler = new TestScheduler((actual, expected) => {
      // asserting the two objects are equal
      // e.g. using chai.
      expect(actual).toEqual(expected);
    });

    // The response's lastUpdated equals the time of 60 seconds after the test started, ensuring they are not perceived
    // as cached values.
    remoteDataTimestamp = new Date().getTime() + 60 * 1000;
    const msToLive = 15 * 60 * 1000;
    const payload: BaseData = Object.assign(new BaseData(), {
      foo: 'bar',
      followLink1: of({}),
      followLink2CustomVariableName: of(createPaginatedList()),
      _links: {
        self: Object.assign(new HALLink(), {
          href: 'self-test-link',
        }),
        followLink1: Object.assign(new HALLink(), {
          href: 'follow-link-1',
        }),
        followLink2: [
          Object.assign(new HALLink(), {
            href: 'follow-link-2-1',
          }),
          Object.assign(new HALLink(), {
            href: 'follow-link-2-2',
          }),
        ],
      },
    });
    const statusCodeSuccess = 200;
    const statusCodeError = 404;
    const errorMessage = 'not found';
    remoteDataMocks = {
      RequestPending: new RemoteData(undefined, msToLive, remoteDataTimestamp, RequestEntryState.RequestPending, undefined, undefined, undefined),
      ResponsePending: new RemoteData(undefined, msToLive, remoteDataTimestamp, RequestEntryState.ResponsePending, undefined, undefined, undefined),
      ResponsePendingStale: new RemoteData(undefined, msToLive, remoteDataTimestamp, RequestEntryState.ResponsePendingStale, undefined, undefined, undefined),
      Success: new RemoteData(remoteDataTimestamp, msToLive, remoteDataTimestamp, RequestEntryState.Success, undefined, payload, statusCodeSuccess),
      SuccessStale: new RemoteData(remoteDataTimestamp, msToLive, remoteDataTimestamp, RequestEntryState.SuccessStale, undefined, payload, statusCodeSuccess),
      Error: new RemoteData(remoteDataTimestamp, msToLive, remoteDataTimestamp, RequestEntryState.Error, errorMessage, undefined, statusCodeError),
      ErrorStale: new RemoteData(remoteDataTimestamp, msToLive, remoteDataTimestamp, RequestEntryState.ErrorStale, errorMessage, undefined, statusCodeError),
    };
    remoteDataPageMocks = {
      RequestPending: new RemoteData(undefined, msToLive, remoteDataTimestamp, RequestEntryState.RequestPending, undefined, undefined, undefined),
      ResponsePending: new RemoteData(undefined, msToLive, remoteDataTimestamp, RequestEntryState.ResponsePending, undefined, undefined, undefined),
      ResponsePendingStale: new RemoteData(undefined, msToLive, remoteDataTimestamp, RequestEntryState.ResponsePendingStale, undefined, undefined, undefined),
      Success: new RemoteData(remoteDataTimestamp, msToLive, remoteDataTimestamp, RequestEntryState.Success, undefined, createPaginatedList([payload]), statusCodeSuccess),
      SuccessStale: new RemoteData(remoteDataTimestamp, msToLive, remoteDataTimestamp, RequestEntryState.SuccessStale, undefined, createPaginatedList([payload]), statusCodeSuccess),
      Error: new RemoteData(remoteDataTimestamp, msToLive, remoteDataTimestamp, RequestEntryState.Error, errorMessage, undefined, statusCodeError),
      ErrorStale: new RemoteData(remoteDataTimestamp, msToLive, remoteDataTimestamp, RequestEntryState.ErrorStale, errorMessage, undefined, statusCodeError),
    };

    return new TestService(
      requestService,
      rdbService,
      objectCache as ObjectCacheService,
      halService,
    );
  }

  beforeEach(() => {
    service = initTestService();
  });

  describe(`reRequestStaleRemoteData`, () => {
    let callback: jasmine.Spy<jasmine.Func>;

    beforeEach(() => {
      callback = jasmine.createSpy();
    });


    describe(`when shouldReRequest is false`, () => {
      it(`shouldn't do anything`, () => {
        testScheduler.run(({ cold, expectObservable, flush }) => {
          const expected = 'a-b-c-d-e-f';
          const values = {
            a: remoteDataMocks.RequestPending,
            b: remoteDataMocks.ResponsePending,
            c: remoteDataMocks.Success,
            d: remoteDataMocks.SuccessStale,
            e: remoteDataMocks.Error,
            f: remoteDataMocks.ErrorStale,
          };

          expectObservable((service as any).reRequestStaleRemoteData(false, callback)(cold(expected, values))).toBe(expected, values);
          // since the callback happens in a tap(), flush to ensure it has been executed
          flush();
          expect(callback).not.toHaveBeenCalled();
        });
      });
    });

    describe(`when shouldReRequest is true`, () => {
      it(`should call the callback for stale RemoteData objects, but still pass the source observable unmodified`, () => {
        testScheduler.run(({ cold, expectObservable, flush }) => {
          const expected = 'a-b';
          const values = {
            a: remoteDataMocks.SuccessStale,
            b: remoteDataMocks.ErrorStale,
          };

          expectObservable((service as any).reRequestStaleRemoteData(true, callback)(cold(expected, values))).toBe(expected, values);
          // since the callback happens in a tap(), flush to ensure it has been executed
          flush();
          expect(callback).toHaveBeenCalledTimes(2);
        });
      });

      it(`should only call the callback for stale RemoteData objects if something is subscribed to it`, (done) => {
        testScheduler.run(({ cold, expectObservable }) => {
          const expected = 'a';
          const values = {
            a: remoteDataMocks.SuccessStale,
          };

          const result$ = (service as any).reRequestStaleRemoteData(true, callback)(cold(expected, values));
          expectObservable(result$).toBe(expected, values);
          expect(callback).not.toHaveBeenCalled();
          result$.subscribe(() => {
            expect(callback).toHaveBeenCalled();
            done();
          });
        });
      });

      it(`shouldn't do anything for RemoteData objects that aren't stale`, () => {
        testScheduler.run(({ cold, expectObservable, flush }) => {
          const expected = 'a-b-c-d';
          const values = {
            a: remoteDataMocks.RequestPending,
            b: remoteDataMocks.ResponsePending,
            c: remoteDataMocks.Success,
            d: remoteDataMocks.Error,
          };

          expectObservable((service as any).reRequestStaleRemoteData(true, callback)(cold(expected, values))).toBe(expected, values);
          // since the callback happens in a tap(), flush to ensure it has been executed
          flush();
          expect(callback).not.toHaveBeenCalled();
        });
      });
    });

  });

  describe(`findByHref`, () => {
    beforeEach(() => {
      spyOn(service as any, 'createAndSendGetRequest').and.callFake((href$) => { href$.subscribe().unsubscribe(); });
    });

    it(`should call buildHrefFromFindOptions with href and linksToFollow`, () => {
      testScheduler.run(({ cold }) => {
        spyOn(service, 'buildHrefFromFindOptions').and.returnValue(selfLink);
        spyOn(rdbService, 'buildSingle').and.returnValue(cold('a', { a: remoteDataMocks.Success }));
        spyOn(service as any, 'reRequestStaleRemoteData').and.returnValue(() => cold('a', { a: remoteDataMocks.Success }));

        service.findByHref(selfLink, true, true, ...linksToFollow);
        expect(service.buildHrefFromFindOptions).toHaveBeenCalledWith(selfLink, {}, [], ...linksToFollow);
      });
    });

    it(`should call createAndSendGetRequest with the result from buildHrefFromFindOptions and useCachedVersionIfAvailable`, () => {
      testScheduler.run(({ cold, expectObservable }) => {
        spyOn(service, 'buildHrefFromFindOptions').and.returnValue('bingo!');
        spyOn(rdbService, 'buildSingle').and.returnValue(cold('a', { a: remoteDataMocks.Success }));
        spyOn(service as any, 'reRequestStaleRemoteData').and.returnValue(() => cold('a', { a: remoteDataMocks.Success }));

        service.findByHref(selfLink, true, true, ...linksToFollow);
        expect((service as any).createAndSendGetRequest).toHaveBeenCalledWith(jasmine.anything(), true);
        expectObservable(rdbService.buildSingle.calls.argsFor(0)[0]).toBe('(a|)', { a: 'bingo!' });

        service.findByHref(selfLink, false, true, ...linksToFollow);
        expect((service as any).createAndSendGetRequest).toHaveBeenCalledWith(jasmine.anything(), false);
        expectObservable(rdbService.buildSingle.calls.argsFor(1)[0]).toBe('(a|)', { a: 'bingo!' });
      });
    });

    it(`should call rdbService.buildSingle with the result from buildHrefFromFindOptions and linksToFollow`, () => {
      testScheduler.run(({ cold, expectObservable }) => {
        spyOn(service, 'buildHrefFromFindOptions').and.returnValue('bingo!');
        spyOn(rdbService, 'buildSingle').and.returnValue(cold('a', { a: remoteDataMocks.Success }));
        spyOn(service as any, 'reRequestStaleRemoteData').and.returnValue(() => cold('a', { a: remoteDataMocks.Success }));

        service.findByHref(selfLink, true, true, ...linksToFollow);
        expect(rdbService.buildSingle).toHaveBeenCalledWith(jasmine.anything() as any, ...linksToFollow);
        expectObservable(rdbService.buildSingle.calls.argsFor(0)[0]).toBe('(a|)', { a: 'bingo!' });
      });
    });

    it(`should return a the output from reRequestStaleRemoteData`, () => {
      testScheduler.run(({ cold, expectObservable }) => {
        spyOn(service, 'buildHrefFromFindOptions').and.returnValue(selfLink);
        spyOn(rdbService, 'buildSingle').and.returnValue(cold('a', { a: remoteDataMocks.Success }));
        spyOn(service as any, 'reRequestStaleRemoteData').and.returnValue(() => cold('a', { a: 'bingo!' }));
        const expected = 'a';
        const values = {
          a: 'bingo!',
        };

        expectObservable(service.findByHref(selfLink, true, true, ...linksToFollow)).toBe(expected, values);
      });
    });

    it(`should call reRequestStaleRemoteData with reRequestOnStale and the exact same findByHref call as a callback`, () => {
      testScheduler.run(({ cold, expectObservable }) => {
        spyOn(service, 'buildHrefFromFindOptions').and.returnValue(selfLink);
        spyOn(rdbService, 'buildSingle').and.returnValue(cold('a', { a: remoteDataMocks.SuccessStale }));
        spyOn(service as any, 'reRequestStaleRemoteData').and.returnValue(() => cold('a', { a: remoteDataMocks.SuccessStale }));

        service.findByHref(selfLink, true, true, ...linksToFollow);
        expect((service as any).reRequestStaleRemoteData.calls.argsFor(0)[0]).toBeTrue();
        spyOn(service, 'findByHref').and.returnValue(cold('a', { a: remoteDataMocks.SuccessStale }));
        // prove that the spy we just added hasn't been called yet
        expect(service.findByHref).not.toHaveBeenCalled();
        // call the callback passed to reRequestStaleRemoteData
        (service as any).reRequestStaleRemoteData.calls.argsFor(0)[1]();
        // verify that findByHref _has_ been called now, with the same params as the original call
        expect(service.findByHref).toHaveBeenCalledWith(jasmine.anything(), true, true, ...linksToFollow);
        // ... except for selflink, which will have been turned in to an observable.
        expectObservable((service.findByHref as jasmine.Spy).calls.argsFor(0)[0]).toBe('(a|)', { a: selfLink });
      });
    });

    describe(`when useCachedVersionIfAvailable is true`, () => {
      beforeEach(() => {
        spyOn(service, 'buildHrefFromFindOptions').and.returnValue(selfLink);
        spyOn(service as any, 'reRequestStaleRemoteData').and.callFake(() => (source) => source);
      });

      it(`should emit a cached completed RemoteData immediately, and keep emitting if it gets rerequested`, () => {
        testScheduler.run(({ cold, expectObservable }) => {
          spyOn(rdbService, 'buildSingle').and.returnValue(cold('a-b-c-d-e', {
            a: remoteDataMocks.Success,
            b: remoteDataMocks.RequestPending,
            c: remoteDataMocks.ResponsePending,
            d: remoteDataMocks.Success,
            e: remoteDataMocks.SuccessStale,
          }));
          const expected = 'a-b-c-d-e';
          const values = {
            a: remoteDataMocks.Success,
            b: remoteDataMocks.RequestPending,
            c: remoteDataMocks.ResponsePending,
            d: remoteDataMocks.Success,
            e: remoteDataMocks.SuccessStale,
          };

          expectObservable(service.findByHref(selfLink, true, true, ...linksToFollow)).toBe(expected, values);
        });
      });

      it(`should not emit a cached stale RemoteData, but only start emitting after the state first changes to RequestPending`, () => {
        testScheduler.run(({ cold, expectObservable }) => {
          spyOn(rdbService, 'buildSingle').and.returnValue(cold('a-b-c-d-e-f-g', {
            a: remoteDataMocks.ResponsePendingStale,
            b: remoteDataMocks.SuccessStale,
            c: remoteDataMocks.ErrorStale,
            d: remoteDataMocks.RequestPending,
            e: remoteDataMocks.ResponsePending,
            f: remoteDataMocks.Success,
            g: remoteDataMocks.SuccessStale,
          }));
          const expected = '------d-e-f-g';
          const values = {
            d: remoteDataMocks.RequestPending,
            e: remoteDataMocks.ResponsePending,
            f: remoteDataMocks.Success,
            g: remoteDataMocks.SuccessStale,
          };

          expectObservable(service.findByHref(selfLink, true, true, ...linksToFollow)).toBe(expected, values);
        });
      });

    });

    describe(`when useCachedVersionIfAvailable is false`, () => {
      beforeEach(() => {
        spyOn(service, 'buildHrefFromFindOptions').and.returnValue(selfLink);
        spyOn(service as any, 'reRequestStaleRemoteData').and.callFake(() => (source) => source);
      });

      it('should not emit a cached completed RemoteData', () => {
        // Old cached value from 1 minute before the test started
        const oldCachedSucceededData: RemoteData<any> = Object.assign({}, remoteDataPageMocks.Success, {
          timeCompleted: remoteDataTimestamp - 2 * 60 * 1000,
          lastUpdated: remoteDataTimestamp - 2 * 60 * 1000,
        } as RemoteData<any>);
        testScheduler.run(({ cold, expectObservable }) => {
          spyOn(rdbService, 'buildSingle').and.returnValue(cold('a-b-c-d-e', {
            a: oldCachedSucceededData,
            b: remoteDataMocks.RequestPending,
            c: remoteDataMocks.ResponsePending,
            d: remoteDataMocks.Success,
            e: remoteDataMocks.SuccessStale,
          }));
          const expected = '--b-c-d-e';
          const values = {
            b: remoteDataMocks.RequestPending,
            c: remoteDataMocks.ResponsePending,
            d: remoteDataMocks.Success,
            e: remoteDataMocks.SuccessStale,
          };

          expectObservable(service.findByHref(selfLink, false, true, ...linksToFollow)).toBe(expected, values);
        });
      });

      it('should emit the first completed RemoteData since the request was made', () => {
        testScheduler.run(({ cold, expectObservable }) => {
          spyOn(rdbService, 'buildSingle').and.returnValue(cold('a-b', {
            a: remoteDataMocks.Success,
            b: remoteDataMocks.SuccessStale,
          }));
          const expected = 'a-b';
          const values = {
            a: remoteDataMocks.Success,
            b: remoteDataMocks.SuccessStale,
          };

          expectObservable(service.findByHref(selfLink, false, true, ...linksToFollow)).toBe(expected, values);
        });
      });

      it(`should not emit a cached stale RemoteData, but only start emitting after the state first changes to RequestPending`, () => {
        testScheduler.run(({ cold, expectObservable }) => {
          spyOn(rdbService, 'buildSingle').and.returnValue(cold('a-b-c-d-e-f-g', {
            a: remoteDataMocks.ResponsePendingStale,
            b: remoteDataMocks.SuccessStale,
            c: remoteDataMocks.ErrorStale,
            d: remoteDataMocks.RequestPending,
            e: remoteDataMocks.ResponsePending,
            f: remoteDataMocks.Success,
            g: remoteDataMocks.SuccessStale,
          }));
          const expected = '------d-e-f-g';
          const values = {
            d: remoteDataMocks.RequestPending,
            e: remoteDataMocks.ResponsePending,
            f: remoteDataMocks.Success,
            g: remoteDataMocks.SuccessStale,
          };

          expectObservable(service.findByHref(selfLink, false, true, ...linksToFollow)).toBe(expected, values);
        });
      });

    });

    it('should link all the followLinks of a cached object by calling addDependency', () => {
      spyOn(objectCache, 'addDependency').and.callThrough();
      testScheduler.run(({ cold, expectObservable, flush }) => {
        spyOn(rdbService, 'buildSingle').and.returnValue(cold('a', {
          a: remoteDataMocks.Success,
        }));
        const expected = 'a';
        const values = {
          a: remoteDataMocks.Success,
        };

        expectObservable(service.findByHref(selfLink, false, false, ...linksToFollow)).toBe(expected, values);
        flush();
        expect(objectCache.addDependency).toHaveBeenCalledTimes(3);
      });
    });
  });

  describe(`findListByHref`, () => {
    let findListOptions;
    beforeEach(() => {
      findListOptions = { currentPage: 5 };
      spyOn(service as any, 'createAndSendGetRequest').and.callFake((href$) => { href$.subscribe().unsubscribe(); });
    });

    it(`should call buildHrefFromFindOptions with href and linksToFollow`, () => {
      testScheduler.run(({ cold }) => {
        spyOn(service, 'buildHrefFromFindOptions').and.returnValue(selfLink);
        spyOn(rdbService, 'buildList').and.returnValue(cold('a', { a: remoteDataPageMocks.Success }));
        spyOn(service as any, 'reRequestStaleRemoteData').and.returnValue(() => cold('a', { a: remoteDataPageMocks.Success }));

        service.findListByHref(selfLink, findListOptions, true, true, ...linksToFollow);
        expect(service.buildHrefFromFindOptions).toHaveBeenCalledWith(selfLink, findListOptions, [], ...linksToFollow);
      });
    });

    it(`should call createAndSendGetRequest with the result from buildHrefFromFindOptions and useCachedVersionIfAvailable`, () => {
      testScheduler.run(({ cold, expectObservable }) => {
        spyOn(service, 'buildHrefFromFindOptions').and.returnValue('bingo!');
        spyOn(rdbService, 'buildList').and.returnValue(cold('a', { a: remoteDataPageMocks.Success }));
        spyOn(service as any, 'reRequestStaleRemoteData').and.returnValue(() => cold('a', { a: remoteDataPageMocks.Success }));

        service.findListByHref(selfLink, findListOptions, true, true, ...linksToFollow);
        expect((service as any).createAndSendGetRequest).toHaveBeenCalledWith(jasmine.anything(), true);
        expectObservable(rdbService.buildList.calls.argsFor(0)[0]).toBe('(a|)', { a: 'bingo!' });

        service.findListByHref(selfLink, findListOptions, false, true, ...linksToFollow);
        expect((service as any).createAndSendGetRequest).toHaveBeenCalledWith(jasmine.anything(), false);
        expectObservable(rdbService.buildList.calls.argsFor(1)[0]).toBe('(a|)', { a: 'bingo!' });
      });
    });

    it(`should call rdbService.buildList with the result from buildHrefFromFindOptions and linksToFollow`, () => {
      testScheduler.run(({ cold, expectObservable }) => {
        spyOn(service, 'buildHrefFromFindOptions').and.returnValue('bingo!');
        spyOn(rdbService, 'buildList').and.returnValue(cold('a', { a: remoteDataPageMocks.Success }));
        spyOn(service as any, 'reRequestStaleRemoteData').and.returnValue(() => cold('a', { a: remoteDataPageMocks.Success }));

        service.findListByHref(selfLink, findListOptions, true, true, ...linksToFollow);
        expect(rdbService.buildList).toHaveBeenCalledWith(jasmine.anything() as any, ...linksToFollow);
        expectObservable(rdbService.buildList.calls.argsFor(0)[0]).toBe('(a|)', { a: 'bingo!' });
      });
    });

    it(`should call reRequestStaleRemoteData with reRequestOnStale and the exact same findListByHref call as a callback`, () => {
      testScheduler.run(({ cold, expectObservable }) => {
        spyOn(service, 'buildHrefFromFindOptions').and.returnValue('bingo!');
        spyOn(rdbService, 'buildList').and.returnValue(cold('a', { a: remoteDataPageMocks.SuccessStale }));
        spyOn(service as any, 'reRequestStaleRemoteData').and.returnValue(() => cold('a', { a: remoteDataPageMocks.SuccessStale }));

        service.findListByHref(selfLink, findListOptions, true, true, ...linksToFollow);
        expect((service as any).reRequestStaleRemoteData.calls.argsFor(0)[0]).toBeTrue();
        spyOn(service, 'findListByHref').and.returnValue(cold('a', { a: remoteDataPageMocks.SuccessStale }));
        // prove that the spy we just added hasn't been called yet
        expect(service.findListByHref).not.toHaveBeenCalled();
        // call the callback passed to reRequestStaleRemoteData
        (service as any).reRequestStaleRemoteData.calls.argsFor(0)[1]();
        // verify that findListByHref _has_ been called now, with the same params as the original call
        expect(service.findListByHref).toHaveBeenCalledWith(jasmine.anything(), findListOptions, true, true, ...linksToFollow);
        // ... except for selflink, which will have been turned in to an observable.
        expectObservable((service.findListByHref as jasmine.Spy).calls.argsFor(0)[0]).toBe('(a|)', { a: selfLink });
      });
    });

    it(`should return a the output from reRequestStaleRemoteData`, () => {
      testScheduler.run(({ cold, expectObservable }) => {
        spyOn(service, 'buildHrefFromFindOptions').and.returnValue(selfLink);
        spyOn(rdbService, 'buildList').and.returnValue(cold('a', { a: remoteDataPageMocks.Success }));
        spyOn(service as any, 'reRequestStaleRemoteData').and.returnValue(() => cold('a', { a: 'bingo!' }));
        const expected = 'a';
        const values = {
          a: 'bingo!',
        };

        expectObservable(service.findListByHref(selfLink, findListOptions, true, true, ...linksToFollow)).toBe(expected, values);
      });
    });

    describe(`when useCachedVersionIfAvailable is true`, () => {
      beforeEach(() => {
        spyOn(service, 'buildHrefFromFindOptions').and.returnValue(selfLink);
        spyOn(service as any, 'reRequestStaleRemoteData').and.callFake(() => (source) => source);
      });

      it(`should emit a cached completed RemoteData immediately, and keep emitting if it gets rerequested`, () => {
        testScheduler.run(({ cold, expectObservable }) => {
          spyOn(rdbService, 'buildList').and.returnValue(cold('a-b-c-d-e', {
            a: remoteDataPageMocks.Success,
            b: remoteDataPageMocks.RequestPending,
            c: remoteDataPageMocks.ResponsePending,
            d: remoteDataPageMocks.Success,
            e: remoteDataPageMocks.SuccessStale,
          }));
          const expected = 'a-b-c-d-e';
          const values = {
            a: remoteDataPageMocks.Success,
            b: remoteDataPageMocks.RequestPending,
            c: remoteDataPageMocks.ResponsePending,
            d: remoteDataPageMocks.Success,
            e: remoteDataPageMocks.SuccessStale,
          };

          expectObservable(service.findListByHref(selfLink, findListOptions, true, true, ...linksToFollow)).toBe(expected, values);
        });
      });

      it(`should not emit a cached stale RemoteData, but only start emitting after the state first changes to RequestPending`, () => {
        testScheduler.run(({ cold, expectObservable }) => {
          spyOn(rdbService, 'buildList').and.returnValue(cold('a-b-c-d-e-f-g', {
            a: remoteDataPageMocks.ResponsePendingStale,
            b: remoteDataPageMocks.SuccessStale,
            c: remoteDataPageMocks.ErrorStale,
            d: remoteDataPageMocks.RequestPending,
            e: remoteDataPageMocks.ResponsePending,
            f: remoteDataPageMocks.Success,
            g: remoteDataPageMocks.SuccessStale,
          }));
          const expected = '------d-e-f-g';
          const values = {
            d: remoteDataPageMocks.RequestPending,
            e: remoteDataPageMocks.ResponsePending,
            f: remoteDataPageMocks.Success,
            g: remoteDataPageMocks.SuccessStale,
          };

          expectObservable(service.findListByHref(selfLink, findListOptions, true, true, ...linksToFollow)).toBe(expected, values);
        });
      });

    });

    describe(`when useCachedVersionIfAvailable is false`, () => {
      beforeEach(() => {
        spyOn(service, 'buildHrefFromFindOptions').and.returnValue(selfLink);
        spyOn(service as any, 'reRequestStaleRemoteData').and.callFake(() => (source) => source);
      });

      it('should not emit a cached completed RemoteData', () => {
        testScheduler.run(({ cold, expectObservable }) => {
          // Old cached value from 1 minute before the test started
          const oldCachedSucceededData: RemoteData<any> = Object.assign({}, remoteDataPageMocks.Success, {
            timeCompleted: remoteDataTimestamp - 2 * 60 * 1000,
            lastUpdated: remoteDataTimestamp - 2 * 60 * 1000,
          } as RemoteData<any>);
          spyOn(rdbService, 'buildList').and.returnValue(cold('a-b-c-d-e', {
            a: oldCachedSucceededData,
            b: remoteDataPageMocks.RequestPending,
            c: remoteDataPageMocks.ResponsePending,
            d: remoteDataPageMocks.Success,
            e: remoteDataPageMocks.SuccessStale,
          }));
          const expected = '--b-c-d-e';
          const values = {
            b: remoteDataPageMocks.RequestPending,
            c: remoteDataPageMocks.ResponsePending,
            d: remoteDataPageMocks.Success,
            e: remoteDataPageMocks.SuccessStale,
          };

          expectObservable(service.findListByHref(selfLink, findListOptions, false, true, ...linksToFollow)).toBe(expected, values);
        });
      });

      it('should emit the first completed RemoteData since the request was made', () => {
        testScheduler.run(({ cold, expectObservable }) => {
          spyOn(rdbService, 'buildList').and.returnValue(cold('a-b', {
            a: remoteDataPageMocks.Success,
            b: remoteDataPageMocks.SuccessStale,
          }));
          const expected = 'a-b';
          const values = {
            a: remoteDataPageMocks.Success,
            b: remoteDataPageMocks.SuccessStale,
          };

          expectObservable(service.findListByHref(selfLink, findListOptions, false, true, ...linksToFollow)).toBe(expected, values);
        });
      });

      it(`should not emit a cached stale RemoteData, but only start emitting after the state first changes to RequestPending`, () => {
        testScheduler.run(({ cold, expectObservable }) => {
          spyOn(rdbService, 'buildList').and.returnValue(cold('a-b-c-d-e-f-g', {
            a: remoteDataPageMocks.ResponsePendingStale,
            b: remoteDataPageMocks.SuccessStale,
            c: remoteDataPageMocks.ErrorStale,
            d: remoteDataPageMocks.RequestPending,
            e: remoteDataPageMocks.ResponsePending,
            f: remoteDataPageMocks.Success,
            g: remoteDataPageMocks.SuccessStale,
          }));
          const expected = '------d-e-f-g';
          const values = {
            d: remoteDataPageMocks.RequestPending,
            e: remoteDataPageMocks.ResponsePending,
            f: remoteDataPageMocks.Success,
            g: remoteDataPageMocks.SuccessStale,
          };


          expectObservable(service.findListByHref(selfLink, findListOptions, false, true, ...linksToFollow)).toBe(expected, values);
        });
      });

      it('should link all the followLinks of the cached objects by calling addDependency', () => {
        spyOn(objectCache, 'addDependency').and.callThrough();
        testScheduler.run(({ cold, expectObservable, flush }) => {
          spyOn(rdbService, 'buildList').and.returnValue(cold('a-b-c-d', {
            a: remoteDataPageMocks.SuccessStale,
            b: remoteDataPageMocks.RequestPending,
            c: remoteDataPageMocks.ResponsePending,
            d: remoteDataPageMocks.Success,
          }));
          const expected = '--b-c-d';
          const values = {
            b: remoteDataPageMocks.RequestPending,
            c: remoteDataPageMocks.ResponsePending,
            d: remoteDataPageMocks.Success,
          };

          expectObservable(service.findListByHref(selfLink, findListOptions, false, false, ...linksToFollow)).toBe(expected, values);
          flush();
          expect(objectCache.addDependency).toHaveBeenCalledTimes(3);
        });
      });
    });
  });

  describe('invalidateByHref', () => {
    let getByHrefSpy: jasmine.Spy;

    beforeEach(() => {
      getByHrefSpy = spyOn(objectCache, 'getByHref').and.returnValue(of({
        requestUUIDs: ['request1', 'request2', 'request3'],
        dependentRequestUUIDs: ['request4', 'request5'],
      } as ObjectCacheEntry));

    });

    it('should call setStaleByUUID for every request associated with this DSO', (done) => {
      service.invalidateByHref('some-href').subscribe((ok) => {
        expect(ok).toBeTrue();
        expect(getByHrefSpy).toHaveBeenCalledWith('some-href');
        expect(requestService.setStaleByUUID).toHaveBeenCalledWith('request1');
        expect(requestService.setStaleByUUID).toHaveBeenCalledWith('request2');
        expect(requestService.setStaleByUUID).toHaveBeenCalledWith('request3');
        expect(requestService.setStaleByUUID).toHaveBeenCalledWith('request4');
        expect(requestService.setStaleByUUID).toHaveBeenCalledWith('request5');
        done();
      });
    });

    it('should call setStaleByUUID even if not subscribing to returned Observable', fakeAsync(() => {
      service.invalidateByHref('some-href');
      tick();

      expect(getByHrefSpy).toHaveBeenCalledWith('some-href');
      expect(requestService.setStaleByUUID).toHaveBeenCalledWith('request1');
      expect(requestService.setStaleByUUID).toHaveBeenCalledWith('request2');
      expect(requestService.setStaleByUUID).toHaveBeenCalledWith('request3');
      expect(requestService.setStaleByUUID).toHaveBeenCalledWith('request4');
      expect(requestService.setStaleByUUID).toHaveBeenCalledWith('request5');
    }));

    it('should return an Observable that only emits true once all requests are stale', () => {
      testScheduler.run(({ cold, expectObservable }) => {
        requestService.setStaleByUUID.and.callFake((uuid) => {
          switch (uuid) {   // fake requests becoming stale at different times
            case 'request1':
              return cold('--(t|)', BOOLEAN);
            case 'request2':
              return cold('------(t|)', BOOLEAN);
            case 'request3':
              return cold('---(t|)', BOOLEAN);
            case 'request4':
              return cold('-(t|)', BOOLEAN);
            case 'request5':
              return cold('----(t|)', BOOLEAN);
          }
        });

        const done$ = service.invalidateByHref('some-href');

        // emit true as soon as the final request is stale
        expectObservable(done$).toBe('------(t|)', BOOLEAN);
      });
    });

    it('should only fire for the current state of the object (instead of tracking it)', () => {
      testScheduler.run(({ cold, flush }) => {
        getByHrefSpy.and.returnValue(cold('a---b---c---', {
          a: { requestUUIDs: ['request1'], dependentRequestUUIDs: [] },  // this is the state at the moment we're invalidating the cache
          b: { requestUUIDs: ['request2'], dependentRequestUUIDs: [] },  // we shouldn't keep tracking the state
          c: { requestUUIDs: ['request3'], dependentRequestUUIDs: [] },  // because we may invalidate when we shouldn't
        }));

        service.invalidateByHref('some-href');
        flush();

        // requests from the first state are marked as stale
        expect(requestService.setStaleByUUID).toHaveBeenCalledWith('request1');

        // request from subsequent states are ignored
        expect(requestService.setStaleByUUID).not.toHaveBeenCalledWith('request2');
        expect(requestService.setStaleByUUID).not.toHaveBeenCalledWith('request3');
      });
    });
  });

  describe('hasCachedResponse', () => {
    it('should return false when the request will be dispatched', (done) => {
      const result = service.hasCachedResponse('test-href');

      result.subscribe((hasCachedResponse) => {
        expect(hasCachedResponse).toBeFalse();
        done();
      });
    });

    it('should return true when the request will not be dispatched', (done) => {
      (requestService.shouldDispatchRequest as jasmine.Spy).and.returnValue(false);
      const result = service.hasCachedResponse('test-href');

      result.subscribe((hasCachedResponse) => {
        expect(hasCachedResponse).toBeTrue();
        done();
      });
    });
  });

  describe('hasCachedErrorResponse', () => {
    it('should return false when no response is cached', (done) => {
      spyOn(service,'hasCachedResponse').and.returnValue(of(false));
      const result = service.hasCachedErrorResponse('test-href');

      result.subscribe((hasCachedErrorResponse) => {
        expect(hasCachedErrorResponse).toBeFalse();
        done();
      });
    });
    it('should return false when no error response is cached', (done) => {
      spyOn(service,'hasCachedResponse').and.returnValue(of(true));
      spyOn(rdbService,'buildSingle').and.returnValue(createSuccessfulRemoteDataObject$({}));

      const result = service.hasCachedErrorResponse('test-href');

      result.subscribe((hasCachedErrorResponse) => {
        expect(hasCachedErrorResponse).toBeFalse();
        done();
      });
    });

    it('should return true when an error response is cached', (done) => {
      spyOn(service,'hasCachedResponse').and.returnValue(of(true));
      spyOn(rdbService,'buildSingle').and.returnValue(createFailedRemoteDataObject$());

      const result = service.hasCachedErrorResponse('test-href');

      result.subscribe((hasCachedErrorResponse) => {
        expect(hasCachedErrorResponse).toBeTrue();
        done();
      });
    });
  });

  describe('addDependency', () => {
    let addDependencySpy;

    beforeEach(() => {
      addDependencySpy = spyOn(objectCache, 'addDependency');
    });

    it('should call objectCache.addDependency with the object\'s self link', () => {
      addDependencySpy.and.callFake((href$: Observable<string>, dependsOn$: Observable<string>) => {
        observableCombineLatest([href$, dependsOn$]).subscribe(([href, dependsOn]) => {
          expect(href).toBe('object-href');
          expect(dependsOn).toBe('dependsOnHref');
        });
      });

      (service as any).addDependency(
        createSuccessfulRemoteDataObject$({ _links: { self: { href: 'object-href' } } }),
        of('dependsOnHref'),
      );
      expect(addDependencySpy).toHaveBeenCalled();
    });

    it('should call objectCache.addDependency without an href if request failed', () => {
      addDependencySpy.and.callFake((href$: Observable<string>, dependsOn$: Observable<string>) => {
        observableCombineLatest([href$, dependsOn$]).subscribe(([href, dependsOn]) => {
          expect(href).toBe(undefined);
          expect(dependsOn).toBe('dependsOnHref');
        });
      });

      (service as any).addDependency(
        createFailedRemoteDataObject$('something went wrong'),
        of('dependsOnHref'),
      );
      expect(addDependencySpy).toHaveBeenCalled();
    });
  });
});
