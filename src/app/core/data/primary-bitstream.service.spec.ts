import { ObjectCacheService } from '../cache/object-cache.service';
import { RequestService } from './request.service';
import { Bitstream } from '../shared/bitstream.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { getMockRemoteDataBuildService } from '../../shared/mocks/remote-data-build.service.mock';
import { PrimaryBitstreamService } from './primary-bitstream.service';
import { BundleDataService } from './bundle-data.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { CreateRequest, DeleteRequest, PostRequest, PutRequest } from './request.models';
import { createFailedRemoteDataObject, createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { Bundle } from '../shared/bundle.model';
import { getTestScheduler } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';

describe('PrimaryBitstreamService', () => {
  let service: PrimaryBitstreamService;
  let objectCache: ObjectCacheService;
  let requestService: RequestService;
  let halService: HALEndpointService;
  let rdbService: RemoteDataBuildService;
  let notificationService: NotificationsService;
  let bundleDataService: BundleDataService;

  const bitstream = Object.assign(new Bitstream(), {
    uuid: 'fake-bitstream',
    _links: {
      self: { href: 'fake-bitstream-self' }
    }
  });

  const bundle = Object.assign(new Bundle(), {
    uuid: 'fake-bundle',
    _links: {
      self: { href: 'fake-bundle-self' },
      primaryBitstream: { href: 'fake-primary-bitstream-self' },
    }
  });

  const url = 'fake-bitstream-url';

  beforeEach(() => {
    objectCache = jasmine.createSpyObj('objectCache', {
      remove: jasmine.createSpy('remove')
    });
    requestService = getMockRequestService();
    halService = Object.assign(new HALEndpointServiceStub(url));

    rdbService = getMockRemoteDataBuildService();
    notificationService = new NotificationsServiceStub() as any;
    bundleDataService = jasmine.createSpyObj('bundleDataService', {'findByHref': createSuccessfulRemoteDataObject$(bundle)});
    service = new PrimaryBitstreamService(requestService, rdbService, objectCache, halService, notificationService, bundleDataService);
  });

  describe('getHttpOptions', () => {
    it('should return a HttpOptions object with text/url-list Context-Type header', () => {
      const result = (service as any).getHttpOptions();
      expect(result.headers.get('Content-Type')).toEqual('text/uri-list');
    });
  });

  describe('createAndSendRequest', () => {
    const testId = '12345-12345';
    const options = {};
    const testResult = createSuccessfulRemoteDataObject(new Bundle());

    beforeEach(() => {
      spyOn(service as any, 'getHttpOptions').and.returnValue(options);
      (requestService.generateRequestId as jasmine.Spy<any>).and.returnValue(testId);
      spyOn(rdbService, 'buildFromRequestUUID').and.returnValue(observableOf(testResult));
    });

    it('should return a Request object with the given constructor and the given parameters', () => {
      const result = (service as any).createAndSendRequest(CreateRequest, url, bitstream.self);
      const request = new CreateRequest(testId, url, bitstream.self, options);
      getTestScheduler().expectObservable(result).toBe('(a|)', { a: testResult });

      expect(requestService.send).toHaveBeenCalledWith(request);
      expect(rdbService.buildFromRequestUUID).toHaveBeenCalledWith(testId);
    });
  });

  describe('create', () => {
    const testResult = createSuccessfulRemoteDataObject(new Bundle());
    beforeEach(() => {
      spyOn((service as any), 'createAndSendRequest').and.returnValue(observableOf(testResult));
    });

    it('should delegate the call to createAndSendRequest', () => {
      const result = service.create(bitstream, bundle);
      getTestScheduler().expectObservable(result).toBe('(a|)', { a: testResult });

      expect((service as any).createAndSendRequest).toHaveBeenCalledWith(
        PostRequest,
        bundle._links.primaryBitstream.href,
        bitstream.self
      );
    });
  });
  describe('put', () => {
    const testResult = createSuccessfulRemoteDataObject(new Bundle());
    beforeEach(() => {
      spyOn((service as any), 'createAndSendRequest').and.returnValue(observableOf(testResult));
    });

    it('should delegate the call to createAndSendRequest and return the requested bundle', () => {
      const result = service.put(bitstream, bundle);
      getTestScheduler().expectObservable(result).toBe('(a|)', { a: testResult });

      expect((service as any).createAndSendRequest).toHaveBeenCalledWith(
        PutRequest,
        bundle._links.primaryBitstream.href,
        bitstream.self
      );
    });
  });
  describe('delete', () => {
    const testBundle = Object.assign(new Bundle(), {
      _links: {
        self: {
          href: 'test-href'
        },
        primaryBitstream: {
          href: 'test-primaryBitstream-href'
        }
      }
    });

    describe('when the delete request succeeds', () => {
      const testResult = createSuccessfulRemoteDataObject(new Bundle());
      const bundleServiceResult = createSuccessfulRemoteDataObject(testBundle);

      beforeEach(() => {
        spyOn((service as any), 'createAndSendRequest').and.returnValue(observableOf(testResult));
        (bundleDataService.findByHref as jasmine.Spy<any>).and.returnValue(observableOf(bundleServiceResult));
      });

      it('should delegate the call to createAndSendRequest', () => {
        const result = service.delete(testBundle);
        getTestScheduler().expectObservable(result).toBe('(a|)', { a: bundleServiceResult });

        result.subscribe();

        expect(bundleDataService.findByHref).toHaveBeenCalledWith(testBundle.self, false);

        expect((service as any).createAndSendRequest).toHaveBeenCalledWith(
          DeleteRequest,
          testBundle._links.primaryBitstream.href,
        );
      });
    });
    describe('when the delete request fails', () => {
      const testResult = createFailedRemoteDataObject();
      const bundleServiceResult = createSuccessfulRemoteDataObject(testBundle);

      beforeEach(() => {
        spyOn((service as any), 'createAndSendRequest').and.returnValue(observableOf(testResult));
        (bundleDataService.findByHref as jasmine.Spy<any>).and.returnValue(observableOf(bundleServiceResult));
      });

      it('should delegate the call to createAndSendRequest and request the bundle from the bundleDataService', () => {
        const result = service.delete(testBundle);
        result.subscribe();
        expect((service as any).createAndSendRequest).toHaveBeenCalledWith(
          DeleteRequest,
          testBundle._links.primaryBitstream.href,
        );
        expect(bundleDataService.findByHref).toHaveBeenCalledWith(testBundle.self, true);

      });

      it('should delegate the call to createAndSendRequest and', () => {
        const result = service.delete(bundle);
        getTestScheduler().expectObservable(result).toBe('(a|)', { a: bundleServiceResult });
      });
    });
  });
});
