/* eslint-disable max-classes-per-file */
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { compare, Operation } from 'fast-json-patch';
import { Observable, of as observableOf } from 'rxjs';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { SortDirection, SortOptions } from '../cache/models/sort-options.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DSpaceObject } from '../shared/dspace-object.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Item } from '../shared/item.model';
import {
  createFailedRemoteDataObject,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../shared/remote-data.utils';
import { ChangeAnalyzer } from './change-analyzer';
import { DataService } from './data.service';
import { PatchRequest } from './request.models';
import { RequestService } from './request.service';
import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { RequestParam } from '../cache/models/request-param.model';
import { getMockRemoteDataBuildService } from '../../shared/mocks/remote-data-build.service.mock';
import { TestScheduler } from 'rxjs/testing';
import { RemoteData } from './remote-data';
import { RequestEntryState } from './request-entry-state.model';
import { CoreState } from '../core-state.model';
import { FindListOptions } from './find-list-options.model';
import { fakeAsync, tick } from '@angular/core/testing';

const endpoint = 'https://rest.api/core';

const BOOLEAN = { f: false, t: true };

class TestService extends DataService<any> {

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected linkPath: string,
    protected halService: HALEndpointService,
    protected objectCache: ObjectCacheService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: ChangeAnalyzer<Item>
  ) {
    super();
  }

  public getBrowseEndpoint(options: FindListOptions = {}, linkPath: string = this.linkPath): Observable<string> {
    return observableOf(endpoint);
  }
}

class DummyChangeAnalyzer implements ChangeAnalyzer<Item> {
  diff(object1: Item, object2: Item): Operation[] {
    return compare((object1 as any).metadata, (object2 as any).metadata);
  }

}

describe('DataService', () => {
  let service: TestService;
  let options: FindListOptions;
  let requestService;
  let halService;
  let rdbService;
  let notificationsService;
  let http;
  let comparator;
  let objectCache;
  let store;
  let selfLink;
  let linksToFollow;
  let testScheduler;
  let remoteDataMocks;

  function initTestService(): TestService {
    requestService = getMockRequestService();
    halService = new HALEndpointServiceStub('url') as any;
    rdbService = getMockRemoteDataBuildService();
    notificationsService = {} as NotificationsService;
    http = {} as HttpClient;
    comparator = new DummyChangeAnalyzer() as any;
    objectCache = {

      addPatch: () => {
        /* empty */
      },
      getObjectBySelfLink: () => {
        /* empty */
      },
      getByHref: () => {
        /* empty */
      }
    } as any;
    store = {} as Store<CoreState>;
    selfLink = 'https://rest.api/endpoint/1698f1d3-be98-4c51-9fd8-6bfedcbd59b7';
    linksToFollow = [
      followLink('a'),
      followLink('b')
    ];

    testScheduler = new TestScheduler((actual, expected) => {
      // asserting the two objects are equal
      // e.g. using chai.
      expect(actual).toEqual(expected);
    });

    const timeStamp = new Date().getTime();
    const msToLive = 15 * 60 * 1000;
    const payload = { foo: 'bar' };
    const statusCodeSuccess = 200;
    const statusCodeError = 404;
    const errorMessage = 'not found';
    remoteDataMocks = {
      RequestPending: new RemoteData(undefined, msToLive, timeStamp, RequestEntryState.RequestPending, undefined, undefined, undefined),
      ResponsePending: new RemoteData(undefined, msToLive, timeStamp, RequestEntryState.ResponsePending, undefined, undefined, undefined),
      Success: new RemoteData(timeStamp, msToLive, timeStamp, RequestEntryState.Success, undefined, payload, statusCodeSuccess),
      SuccessStale: new RemoteData(timeStamp, msToLive, timeStamp, RequestEntryState.SuccessStale, undefined, payload, statusCodeSuccess),
      Error: new RemoteData(timeStamp, msToLive, timeStamp, RequestEntryState.Error, errorMessage, undefined, statusCodeError),
      ErrorStale: new RemoteData(timeStamp, msToLive, timeStamp, RequestEntryState.ErrorStale, errorMessage, undefined, statusCodeError),
    };


    return new TestService(
      requestService,
      rdbService,
      store,
      endpoint,
      halService,
      objectCache,
      notificationsService,
      http,
      comparator,
    );
  }

  beforeEach(() => {
    service = initTestService();
  });

  describe('getFindAllHref', () => {

    it('should return an observable with the endpoint', () => {
      options = {};

      (service as any).getFindAllHref(options).subscribe((value) => {
          expect(value).toBe(endpoint);
        }
      );
    });

    it('should include page in href if currentPage provided in options', () => {
      options = { currentPage: 2 };
      const expected = `${endpoint}?page=${options.currentPage - 1}`;

      (service as any).getFindAllHref(options).subscribe((value) => {
        expect(value).toBe(expected);
      });
    });

    it('should include size in href if elementsPerPage provided in options', () => {
      options = { elementsPerPage: 5 };
      const expected = `${endpoint}?size=${options.elementsPerPage}`;

      (service as any).getFindAllHref(options).subscribe((value) => {
        expect(value).toBe(expected);
      });
    });

    it('should include sort href if SortOptions provided in options', () => {
      const sortOptions = new SortOptions('field1', SortDirection.ASC);
      options = { sort: sortOptions };
      const expected = `${endpoint}?sort=${sortOptions.field},${sortOptions.direction}`;

      (service as any).getFindAllHref(options).subscribe((value) => {
        expect(value).toBe(expected);
      });
    });

    it('should include startsWith in href if startsWith provided in options', () => {
      options = { startsWith: 'ab' };
      const expected = `${endpoint}?startsWith=${options.startsWith}`;

      (service as any).getFindAllHref(options).subscribe((value) => {
        expect(value).toBe(expected);
      });
    });

    it('should include all provided options in href', () => {
      const sortOptions = new SortOptions('field1', SortDirection.DESC);
      options = {
        currentPage: 6,
        elementsPerPage: 10,
        sort: sortOptions,
        startsWith: 'ab',

      };
      const expected = `${endpoint}?page=${options.currentPage - 1}&size=${options.elementsPerPage}` +
        `&sort=${sortOptions.field},${sortOptions.direction}&startsWith=${options.startsWith}`;

      (service as any).getFindAllHref(options).subscribe((value) => {
        expect(value).toBe(expected);
      });
    });

    it('should include all searchParams in href if any provided in options', () => {
      options = {
        searchParams: [
          new RequestParam('param1', 'test'),
          new RequestParam('param2', 'test2'),
        ]
      };
      const expected = `${endpoint}?param1=test&param2=test2`;

      (service as any).getFindAllHref(options).subscribe((value) => {
        expect(value).toBe(expected);
      });
    });

    it('should include linkPath in href if any provided', () => {
      const expected = `${endpoint}/test/entries`;

      (service as any).getFindAllHref({}, 'test/entries').subscribe((value) => {
        expect(value).toBe(expected);
      });
    });

    it('should include single linksToFollow as embed', () => {
      const expected = `${endpoint}?embed=bundles`;

      (service as any).getFindAllHref({}, null, followLink('bundles')).subscribe((value) => {
        expect(value).toBe(expected);
      });
    });

    it('should include single linksToFollow as embed and its size', () => {
      const expected = `${endpoint}?embed.size=bundles=5&embed=bundles`;
      const config: FindListOptions = Object.assign(new FindListOptions(), {
        elementsPerPage: 5
      });
      (service as any).getFindAllHref({}, null, followLink('bundles', { findListOptions: config })).subscribe((value) => {
        expect(value).toBe(expected);
      });
    });

    it('should include multiple linksToFollow as embed', () => {
      const expected = `${endpoint}?embed=bundles&embed=owningCollection&embed=templateItemOf`;

      (service as any).getFindAllHref({}, null, followLink('bundles'), followLink('owningCollection'), followLink('templateItemOf')).subscribe((value) => {
        expect(value).toBe(expected);
      });
    });

    it('should include multiple linksToFollow as embed and its sizes if given', () => {
      const expected = `${endpoint}?embed=bundles&embed.size=owningCollection=2&embed=owningCollection&embed=templateItemOf`;

      const config: FindListOptions = Object.assign(new FindListOptions(), {
        elementsPerPage: 2
      });

      (service as any).getFindAllHref({}, null, followLink('bundles'), followLink('owningCollection', { findListOptions: config }), followLink('templateItemOf')).subscribe((value) => {
        expect(value).toBe(expected);
      });
    });

    it('should not include linksToFollow with shouldEmbed = false', () => {
      const expected = `${endpoint}?embed=templateItemOf`;

      (service as any).getFindAllHref(
        {},
        null,
        followLink('bundles', { shouldEmbed: false }),
        followLink('owningCollection', { shouldEmbed: false }),
        followLink('templateItemOf')
      ).subscribe((value) => {
        expect(value).toBe(expected);
      });
    });

    it('should include nested linksToFollow 3lvl', () => {
      const expected = `${endpoint}?embed=owningCollection/itemtemplate/relationships`;

      (service as any).getFindAllHref({}, null, followLink('owningCollection', {}, followLink('itemtemplate', {}, followLink('relationships')))).subscribe((value) => {
        expect(value).toBe(expected);
      });
    });

    it('should include nested linksToFollow 2lvl and nested embed\'s size', () => {
      const expected = `${endpoint}?embed.size=owningCollection/itemtemplate=4&embed=owningCollection/itemtemplate`;
      const config: FindListOptions = Object.assign(new FindListOptions(), {
        elementsPerPage: 4
      });
      (service as any).getFindAllHref({}, null, followLink('owningCollection', {}, followLink('itemtemplate', { findListOptions: config }))).subscribe((value) => {
        expect(value).toBe(expected);
      });
    });
  });

  describe('getIDHref', () => {
    const endpointMock = 'https://dspace7-internal.atmire.com/server/api/core/items';
    const resourceIdMock = '003c99b4-d4fe-44b0-a945-e12182a7ca89';

    it('should return endpoint', () => {
      const result = (service as any).getIDHref(endpointMock, resourceIdMock);
      expect(result).toEqual(endpointMock + '/' + resourceIdMock);
    });

    it('should include single linksToFollow as embed', () => {
      const expected = `${endpointMock}/${resourceIdMock}?embed=bundles`;
      const result = (service as any).getIDHref(endpointMock, resourceIdMock, followLink('bundles'));
      expect(result).toEqual(expected);
    });

    it('should include multiple linksToFollow as embed', () => {
      const expected = `${endpointMock}/${resourceIdMock}?embed=bundles&embed=owningCollection&embed=templateItemOf`;
      const result = (service as any).getIDHref(endpointMock, resourceIdMock, followLink('bundles'), followLink('owningCollection'), followLink('templateItemOf'));
      expect(result).toEqual(expected);
    });

    it('should not include linksToFollow with shouldEmbed = false', () => {
      const expected = `${endpointMock}/${resourceIdMock}?embed=templateItemOf`;
      const result = (service as any).getIDHref(
        endpointMock,
        resourceIdMock,
        followLink('bundles', { shouldEmbed: false }),
        followLink('owningCollection', { shouldEmbed: false }),
        followLink('templateItemOf')
      );
      expect(result).toEqual(expected);
    });

    it('should include nested linksToFollow 3lvl', () => {
      const expected = `${endpointMock}/${resourceIdMock}?embed=owningCollection/itemtemplate/relationships`;
      const result = (service as any).getIDHref(endpointMock, resourceIdMock, followLink('owningCollection', {}, followLink('itemtemplate', {}, followLink('relationships'))));
      expect(result).toEqual(expected);
    });
  });

  describe('patch', () => {
    const dso = {
      uuid: 'dso-uuid'
    };
    const operations = [
      Object.assign({
        op: 'move',
        from: '/1',
        path: '/5'
      }) as Operation
    ];

    beforeEach(() => {
      service.patch(dso, operations);
    });

    it('should send a PatchRequest', () => {
      expect(requestService.send).toHaveBeenCalledWith(jasmine.any(PatchRequest));
    });
  });

  describe('update', () => {
    let operations;
    let dso;
    let dso2;
    const name1 = 'random string';
    const name2 = 'another random string';
    beforeEach(() => {
      operations = [{ op: 'replace', path: '/0/value', value: name2 } as Operation];

      dso = Object.assign(new DSpaceObject(), {
        _links: { self: { href: selfLink } },
        metadata: [{ key: 'dc.title', value: name1 }]
      });

      dso2 = Object.assign(new DSpaceObject(), {
        _links: { self: { href: selfLink } },
        metadata: [{ key: 'dc.title', value: name2 }]
      });

      spyOn(service, 'findByHref').and.returnValue(createSuccessfulRemoteDataObject$(dso));
      spyOn(objectCache, 'addPatch');
    });

    it('should call addPatch on the object cache with the right parameters when there are differences', () => {
      service.update(dso2).subscribe();
      expect(objectCache.addPatch).toHaveBeenCalledWith(selfLink, operations);
    });

    it('should not call addPatch on the object cache with the right parameters when there are no differences', () => {
      service.update(dso).subscribe();
      expect(objectCache.addPatch).not.toHaveBeenCalled();
    });
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
          spyOn(rdbService, 'buildSingle').and.returnValue(cold('a-b-c-d-e', {
            a: remoteDataMocks.SuccessStale,
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

          expectObservable(service.findByHref(selfLink, true, true, ...linksToFollow)).toBe(expected, values);
        });
      });

    });

    describe(`when useCachedVersionIfAvailable is false`, () => {
      beforeEach(() => {
        spyOn(service, 'buildHrefFromFindOptions').and.returnValue(selfLink);
        spyOn(service as any, 'reRequestStaleRemoteData').and.callFake(() => (source) => source);
      });


      it(`should not emit a cached completed RemoteData, but only start emitting after the state first changes to RequestPending`, () => {
        testScheduler.run(({ cold, expectObservable }) => {
          spyOn(rdbService, 'buildSingle').and.returnValue(cold('a-b-c-d-e', {
            a: remoteDataMocks.Success,
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

      it(`should not emit a cached stale RemoteData, but only start emitting after the state first changes to RequestPending`, () => {
        testScheduler.run(({ cold, expectObservable }) => {
          spyOn(rdbService, 'buildSingle').and.returnValue(cold('a-b-c-d-e', {
            a: remoteDataMocks.SuccessStale,
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

    });

  });

  describe(`findAllByHref`, () => {
    let findListOptions;
    beforeEach(() => {
      findListOptions = { currentPage: 5 };
      spyOn(service as any, 'createAndSendGetRequest').and.callFake((href$) => { href$.subscribe().unsubscribe(); });
    });

    it(`should call buildHrefFromFindOptions with href and linksToFollow`, () => {
      testScheduler.run(({ cold }) => {
        spyOn(service, 'buildHrefFromFindOptions').and.returnValue(selfLink);
        spyOn(rdbService, 'buildList').and.returnValue(cold('a', { a: remoteDataMocks.Success }));
        spyOn(service as any, 'reRequestStaleRemoteData').and.returnValue(() => cold('a', { a: remoteDataMocks.Success }));

        service.findAllByHref(selfLink, findListOptions, true, true, ...linksToFollow);
        expect(service.buildHrefFromFindOptions).toHaveBeenCalledWith(selfLink, findListOptions, [], ...linksToFollow);
      });
    });

    it(`should call createAndSendGetRequest with the result from buildHrefFromFindOptions and useCachedVersionIfAvailable`, () => {
      testScheduler.run(({ cold, expectObservable }) => {
        spyOn(service, 'buildHrefFromFindOptions').and.returnValue('bingo!');
        spyOn(rdbService, 'buildList').and.returnValue(cold('a', { a: remoteDataMocks.Success }));
        spyOn(service as any, 'reRequestStaleRemoteData').and.returnValue(() => cold('a', { a: remoteDataMocks.Success }));

        service.findAllByHref(selfLink, findListOptions, true, true, ...linksToFollow);
        expect((service as any).createAndSendGetRequest).toHaveBeenCalledWith(jasmine.anything(), true);
        expectObservable(rdbService.buildList.calls.argsFor(0)[0]).toBe('(a|)', { a: 'bingo!' });

        service.findAllByHref(selfLink, findListOptions, false, true, ...linksToFollow);
        expect((service as any).createAndSendGetRequest).toHaveBeenCalledWith(jasmine.anything(), false);
        expectObservable(rdbService.buildList.calls.argsFor(1)[0]).toBe('(a|)', { a: 'bingo!' });
      });
    });

    it(`should call rdbService.buildList with the result from buildHrefFromFindOptions and linksToFollow`, () => {
      testScheduler.run(({ cold, expectObservable }) => {
        spyOn(service, 'buildHrefFromFindOptions').and.returnValue('bingo!');
        spyOn(rdbService, 'buildList').and.returnValue(cold('a', { a: remoteDataMocks.Success }));
        spyOn(service as any, 'reRequestStaleRemoteData').and.returnValue(() => cold('a', { a: remoteDataMocks.Success }));

        service.findAllByHref(selfLink, findListOptions, true, true, ...linksToFollow);
        expect(rdbService.buildList).toHaveBeenCalledWith(jasmine.anything() as any, ...linksToFollow);
        expectObservable(rdbService.buildList.calls.argsFor(0)[0]).toBe('(a|)', { a: 'bingo!' });
      });
    });

    it(`should call reRequestStaleRemoteData with reRequestOnStale and the exact same findAllByHref call as a callback`, () => {
      testScheduler.run(({ cold, expectObservable }) => {
        spyOn(service, 'buildHrefFromFindOptions').and.returnValue('bingo!');
        spyOn(rdbService, 'buildList').and.returnValue(cold('a', { a: remoteDataMocks.SuccessStale }));
        spyOn(service as any, 'reRequestStaleRemoteData').and.returnValue(() => cold('a', { a: remoteDataMocks.SuccessStale }));

        service.findAllByHref(selfLink, findListOptions, true, true, ...linksToFollow);
        expect((service as any).reRequestStaleRemoteData.calls.argsFor(0)[0]).toBeTrue();
        spyOn(service, 'findAllByHref').and.returnValue(cold('a', { a: remoteDataMocks.SuccessStale }));
        // prove that the spy we just added hasn't been called yet
        expect(service.findAllByHref).not.toHaveBeenCalled();
        // call the callback passed to reRequestStaleRemoteData
        (service as any).reRequestStaleRemoteData.calls.argsFor(0)[1]();
        // verify that findAllByHref _has_ been called now, with the same params as the original call
        expect(service.findAllByHref).toHaveBeenCalledWith(jasmine.anything(), findListOptions, true, true, ...linksToFollow);
        // ... except for selflink, which will have been turned in to an observable.
        expectObservable((service.findAllByHref as jasmine.Spy).calls.argsFor(0)[0]).toBe('(a|)', { a: selfLink });
      });
    });

    it(`should return a the output from reRequestStaleRemoteData`, () => {
      testScheduler.run(({ cold, expectObservable }) => {
        spyOn(service, 'buildHrefFromFindOptions').and.returnValue(selfLink);
        spyOn(rdbService, 'buildList').and.returnValue(cold('a', { a: remoteDataMocks.Success }));
        spyOn(service as any, 'reRequestStaleRemoteData').and.returnValue(() => cold('a', { a: 'bingo!' }));
        const expected = 'a';
        const values = {
          a: 'bingo!',
        };

        expectObservable(service.findAllByHref(selfLink, findListOptions, true, true, ...linksToFollow)).toBe(expected, values);
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

          expectObservable(service.findAllByHref(selfLink, findListOptions, true, true, ...linksToFollow)).toBe(expected, values);
        });
      });

      it(`should not emit a cached stale RemoteData, but only start emitting after the state first changes to RequestPending`, () => {
        testScheduler.run(({ cold, expectObservable }) => {
          spyOn(rdbService, 'buildList').and.returnValue(cold('a-b-c-d-e', {
            a: remoteDataMocks.SuccessStale,
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

          expectObservable(service.findAllByHref(selfLink, findListOptions, true, true, ...linksToFollow)).toBe(expected, values);
        });
      });

    });

    describe(`when useCachedVersionIfAvailable is false`, () => {
      beforeEach(() => {
        spyOn(service, 'buildHrefFromFindOptions').and.returnValue(selfLink);
        spyOn(service as any, 'reRequestStaleRemoteData').and.callFake(() => (source) => source);
      });


      it(`should not emit a cached completed RemoteData, but only start emitting after the state first changes to RequestPending`, () => {
        testScheduler.run(({ cold, expectObservable }) => {
          spyOn(rdbService, 'buildList').and.returnValue(cold('a-b-c-d-e', {
            a: remoteDataMocks.Success,
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

          expectObservable(service.findAllByHref(selfLink, findListOptions, false, true, ...linksToFollow)).toBe(expected, values);
        });
      });

      it(`should not emit a cached stale RemoteData, but only start emitting after the state first changes to RequestPending`, () => {
        testScheduler.run(({ cold, expectObservable }) => {
          spyOn(rdbService, 'buildList').and.returnValue(cold('a-b-c-d-e', {
            a: remoteDataMocks.SuccessStale,
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

          expectObservable(service.findAllByHref(selfLink, findListOptions, false, true, ...linksToFollow)).toBe(expected, values);
        });
      });

    });
  });

  describe('invalidateByHref', () => {
    let getByHrefSpy: jasmine.Spy;

    beforeEach(() => {
      getByHrefSpy = spyOn(objectCache, 'getByHref').and.returnValue(observableOf({
        requestUUIDs: ['request1', 'request2', 'request3']
      }));

    });

    it('should call setStaleByUUID for every request associated with this DSO', (done) => {
      service.invalidateByHref('some-href').subscribe((ok) => {
        expect(ok).toBeTrue();
        expect(getByHrefSpy).toHaveBeenCalledWith('some-href');
        expect(requestService.setStaleByUUID).toHaveBeenCalledWith('request1');
        expect(requestService.setStaleByUUID).toHaveBeenCalledWith('request2');
        expect(requestService.setStaleByUUID).toHaveBeenCalledWith('request3');
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
    }));

    it('should return an Observable that only emits true once all requests are stale', () => {
      testScheduler.run(({ cold, expectObservable }) => {
        requestService.setStaleByUUID.and.callFake((uuid) => {
          switch (uuid) {   // fake requests becoming stale at different times
            case 'request1':
              return cold('--(t|)', BOOLEAN);
            case 'request2':
              return cold('----(t|)', BOOLEAN);
            case 'request3':
              return cold('------(t|)', BOOLEAN);
          }
        });

        const done$ = service.invalidateByHref('some-href');

        // emit true as soon as the final request is stale
        expectObservable(done$).toBe('------(t|)', BOOLEAN);
      });
    });
  });

  describe('delete', () => {
    let MOCK_SUCCEEDED_RD;
    let MOCK_FAILED_RD;

    let invalidateByHrefSpy: jasmine.Spy;
    let buildFromRequestUUIDSpy: jasmine.Spy;
    let getIDHrefObsSpy: jasmine.Spy;
    let deleteByHrefSpy: jasmine.Spy;

    beforeEach(() => {
      invalidateByHrefSpy = spyOn(service, 'invalidateByHref').and.returnValue(observableOf(true));
      buildFromRequestUUIDSpy = spyOn(rdbService, 'buildFromRequestUUID').and.callThrough();
      getIDHrefObsSpy = spyOn(service, 'getIDHrefObs').and.callThrough();
      deleteByHrefSpy = spyOn(service, 'deleteByHref').and.callThrough();

      MOCK_SUCCEEDED_RD = createSuccessfulRemoteDataObject({});
      MOCK_FAILED_RD = createFailedRemoteDataObject('something went wrong');
    });

    it('should retrieve href by ID and call deleteByHref', () => {
      getIDHrefObsSpy.and.returnValue(observableOf('some-href'));
      buildFromRequestUUIDSpy.and.returnValue(createSuccessfulRemoteDataObject$({}));

      service.delete('some-id', ['a', 'b', 'c']).subscribe(rd => {
        expect(getIDHrefObsSpy).toHaveBeenCalledWith('some-id');
        expect(deleteByHrefSpy).toHaveBeenCalledWith('some-href', ['a', 'b', 'c']);
      });
    });

    describe('deleteByHref', () => {
      it('should call invalidateByHref if the DELETE request succeeds', (done) => {
        buildFromRequestUUIDSpy.and.returnValue(observableOf(MOCK_SUCCEEDED_RD));

        service.deleteByHref('some-href').subscribe(rd => {
          expect(rd).toBe(MOCK_SUCCEEDED_RD);
          expect(invalidateByHrefSpy).toHaveBeenCalled();
          done();
        });
      });

      it('should call invalidateByHref even if not subscribing to returned Observable', fakeAsync(() => {
        buildFromRequestUUIDSpy.and.returnValue(observableOf(MOCK_SUCCEEDED_RD));

        service.deleteByHref('some-href');
        tick();

        expect(invalidateByHrefSpy).toHaveBeenCalled();
      }));

      it('should not call invalidateByHref if the DELETE request fails', (done) => {
        buildFromRequestUUIDSpy.and.returnValue(observableOf(MOCK_FAILED_RD));

        service.deleteByHref('some-href').subscribe(rd => {
          expect(rd).toBe(MOCK_FAILED_RD);
          expect(invalidateByHrefSpy).not.toHaveBeenCalled();
          done();
        });
      });

      it('should wait for invalidateByHref before emitting', () => {
        testScheduler.run(({ cold, expectObservable }) => {
          buildFromRequestUUIDSpy.and.returnValue(
            cold('(r|)', { r: MOCK_SUCCEEDED_RD})      // RD emits right away
          );
          invalidateByHrefSpy.and.returnValue(
            cold('----(t|)', BOOLEAN)                  // but we pretend that setting requests to stale takes longer
          );

          const done$ = service.deleteByHref('some-href');
          expectObservable(done$).toBe(
            '----(r|)', { r: MOCK_SUCCEEDED_RD}        // ...and expect the returned Observable to wait until that's done
          );
        });
      });

      it('should wait for the DELETE request to resolve before emitting', () => {
        testScheduler.run(({ cold, expectObservable }) => {
          buildFromRequestUUIDSpy.and.returnValue(
            cold('----(r|)', { r: MOCK_SUCCEEDED_RD})   // the request takes a while
          );
          invalidateByHrefSpy.and.returnValue(
            cold('(t|)', BOOLEAN)                       // but we pretend that setting to stale happens sooner
          );                                            // e.g.: maybe already stale before this call?

          const done$ = service.deleteByHref('some-href');
          expectObservable(done$).toBe(
            '----(r|)', { r: MOCK_SUCCEEDED_RD}         // ...and expect the returned Observable to wait for the request
          );
        });
      });
    });
  });
});
