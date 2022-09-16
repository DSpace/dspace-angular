/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { constructIdEndpointDefault } from './identifiable-data.service';
import { RequestService } from '../request.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { FindListOptions } from '../find-list-options.model';
import { Observable, of as observableOf } from 'rxjs';
import { getMockRequestService } from '../../../shared/mocks/request.service.mock';
import { HALEndpointServiceStub } from '../../../shared/testing/hal-endpoint-service.stub';
import { getMockRemoteDataBuildService } from '../../../shared/mocks/remote-data-build.service.mock';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import { TestScheduler } from 'rxjs/testing';
import { RemoteData } from '../remote-data';
import { RequestEntryState } from '../request-entry-state.model';
import { DeleteData, DeleteDataImpl } from './delete-data';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { createFailedRemoteDataObject, createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { fakeAsync, tick } from '@angular/core/testing';

/**
 * Tests whether calls to `DeleteData` methods are correctly patched through in a concrete data service that implements it
 */
export function testDeleteDataImplementation(serviceFactory: () => DeleteData<any>) {
  let service;

  describe('DeleteData implementation', () => {
    const ID = '2ce78f3a-791b-4d70-b5eb-753d587bbadd';
    const HREF = 'https://rest.api/core/items/' + ID;
    const COPY_VIRTUAL_METADATA = [
      'a', 'b', 'c'
    ];

    beforeAll(() => {
      service = serviceFactory();
      (service as any).deleteData = jasmine.createSpyObj('deleteData', {
        delete: 'TEST delete',
        deleteByHref: 'TEST deleteByHref',
      });
    });

    it('should handle calls to delete', () => {
      const out: any = service.delete(ID, COPY_VIRTUAL_METADATA);

      expect((service as any).deleteData.delete).toHaveBeenCalledWith(ID, COPY_VIRTUAL_METADATA);
      expect(out).toBe('TEST delete');
    });

    it('should handle calls to deleteByHref', () => {
      const out: any = service.deleteByHref(HREF, COPY_VIRTUAL_METADATA);

      expect((service as any).deleteData.deleteByHref).toHaveBeenCalledWith(HREF, COPY_VIRTUAL_METADATA);
      expect(out).toBe('TEST deleteByHref');
    });
  });
}

const endpoint = 'https://rest.api/core';

const BOOLEAN = { f: false, t: true };

class TestService extends DeleteDataImpl<any> {
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
  ) {
    super(undefined, requestService, rdbService, objectCache, halService, notificationsService, undefined, constructIdEndpointDefault);
  }

  public getBrowseEndpoint(options: FindListOptions = {}, linkPath: string = this.linkPath): Observable<string> {
    return observableOf(endpoint);
  }
}

describe('DeleteDataImpl', () => {
  let service: TestService;
  let requestService;
  let halService;
  let rdbService;
  let objectCache;
  let notificationsService;
  let selfLink;
  let linksToFollow;
  let testScheduler;
  let remoteDataMocks;

  function initTestService(): TestService {
    requestService = getMockRequestService();
    halService = new HALEndpointServiceStub('url') as any;
    rdbService = getMockRemoteDataBuildService();
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
    notificationsService = {} as NotificationsService;
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
      objectCache,
      halService,
      notificationsService,
    );
  }

  beforeEach(() => {
    service = initTestService();
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
