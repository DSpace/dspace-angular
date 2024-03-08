import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import {
  Observable,
  of as observableOf,
} from 'rxjs';
import { ItemMock } from 'src/app/shared/mocks/item.mock';
import {
  createFailedRemoteDataObject,
  createSuccessfulRemoteDataObject,
} from 'src/app/shared/remote-data.utils';

import { getMockRemoteDataBuildService } from '../../shared/mocks/remote-data-build.service.mock';
import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { Bitstream } from '../shared/bitstream.model';
import { BitstreamFormat } from '../shared/bitstream-format.model';
import { BitstreamFormatSupportLevel } from '../shared/bitstream-format-support-level';
import { Bundle } from '../shared/bundle.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { testDeleteDataImplementation } from './base/delete-data.spec';
import { testPatchDataImplementation } from './base/patch-data.spec';
import { testSearchDataImplementation } from './base/search-data.spec';
import { BitstreamDataService } from './bitstream-data.service';
import { BitstreamFormatDataService } from './bitstream-format-data.service';
import { BundleDataService } from './bundle-data.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { RemoteData } from './remote-data';
import {
  PatchRequest,
  PutRequest,
} from './request.models';
import { RequestService } from './request.service';
import objectContaining = jasmine.objectContaining;

describe('BitstreamDataService', () => {
  let service: BitstreamDataService;
  let objectCache: ObjectCacheService;
  let requestService: RequestService;
  let halService: HALEndpointService;
  let bitstreamFormatService: BitstreamFormatDataService;
  let rdbService: RemoteDataBuildService;
  let bundleDataService: BundleDataService;
  const bitstreamFormatHref = 'rest-api/bitstreamformats';

  const bitstream1 = Object.assign(new Bitstream(), {
    id: 'fake-bitstream1',
    uuid: 'fake-bitstream1',
    _links: {
      self: { href: 'fake-bitstream1-self' },
    },
  });
  const bitstream2 = Object.assign(new Bitstream(), {
    id: 'fake-bitstream2',
    uuid: 'fake-bitstream2',
    _links: {
      self: { href: 'fake-bitstream2-self' },
    },
  });
  const format = Object.assign(new BitstreamFormat(), {
    id: '2',
    shortDescription: 'PNG',
    description: 'Portable Network Graphics',
    supportLevel: BitstreamFormatSupportLevel.Known,
  });
  const url = 'fake-bitstream-url';

  beforeEach(() => {
    objectCache = jasmine.createSpyObj('objectCache', {
      remove: jasmine.createSpy('remove'),
    });
    requestService = getMockRequestService();
    halService = Object.assign(new HALEndpointServiceStub(url));
    bitstreamFormatService = jasmine.createSpyObj('bistreamFormatService', {
      getBrowseEndpoint: observableOf(bitstreamFormatHref),
    });

    rdbService = getMockRemoteDataBuildService();

    TestBed.configureTestingModule({
      providers: [
        { provide: ObjectCacheService, useValue: objectCache },
        { provide: RequestService, useValue: requestService },
        { provide: HALEndpointService, useValue: halService },
        { provide: BitstreamFormatDataService, useValue: bitstreamFormatService },
        { provide: RemoteDataBuildService, useValue: rdbService },
        { provide: DSOChangeAnalyzer, useValue: {} },
        { provide: NotificationsService, useValue: {} },
      ],
    });
    service = TestBed.inject(BitstreamDataService);
    bundleDataService = TestBed.inject(BundleDataService);
  });

  describe('composition', () => {
    const initService = () => new BitstreamDataService(null, null, null, null, null, null, null, null);
    testSearchDataImplementation(initService);
    testPatchDataImplementation(initService);
    testDeleteDataImplementation(initService);
  });

  describe('when updating the bitstream\'s format', () => {
    beforeEach(() => {
      service.updateFormat(bitstream1, format);
    });

    it('should send a put request', () => {
      expect(requestService.send).toHaveBeenCalledWith(jasmine.any(PutRequest));
    });
  });

  describe('removeMultiple', () => {
    function mockBuildFromRequestUUIDAndAwait(requestUUID$: string | Observable<string>, callback: (rd?: RemoteData<any>) => Observable<unknown>, ..._linksToFollow: FollowLinkConfig<any>[]): Observable<RemoteData<any>> {
      callback();
      return;
    }

    beforeEach(() => {
      spyOn(service, 'invalidateByHref');
      spyOn(rdbService, 'buildFromRequestUUIDAndAwait').and.callFake((requestUUID$: string | Observable<string>, callback: (rd?: RemoteData<any>) => Observable<unknown>, ...linksToFollow: FollowLinkConfig<any>[]) => mockBuildFromRequestUUIDAndAwait(requestUUID$, callback, ...linksToFollow));
    });

    it('should be able to 1 bitstream', () => {
      service.removeMultiple([bitstream1]);

      expect(requestService.send).toHaveBeenCalledWith(objectContaining({
        href: `${url}/bitstreams`,
        body: [
          { op: 'remove', path: '/bitstreams/fake-bitstream1' },
        ],
      } as PatchRequest));
      expect(service.invalidateByHref).toHaveBeenCalledWith('fake-bitstream1-self');
    });

    describe('findPrimaryBitstreamByItemAndName', () => {
      it('should return primary bitstream', () => {
        const exprected$ = cold('(a|)', { a: bitstream1 } );
        const bundle = Object.assign(new Bundle(), {
          primaryBitstream: observableOf(createSuccessfulRemoteDataObject(bitstream1)),
        });
        spyOn(bundleDataService, 'findByItemAndName').and.returnValue(observableOf(createSuccessfulRemoteDataObject(bundle)));
        expect(service.findPrimaryBitstreamByItemAndName(ItemMock, 'ORIGINAL')).toBeObservable(exprected$);
      });

      it('should return null if primary bitstream has not be succeeded ', () => {
        const exprected$ = cold('(a|)', { a: null } );
        const bundle = Object.assign(new Bundle(), {
          primaryBitstream: observableOf(createFailedRemoteDataObject()),
        });
        spyOn(bundleDataService, 'findByItemAndName').and.returnValue(observableOf(createSuccessfulRemoteDataObject(bundle)));
        expect(service.findPrimaryBitstreamByItemAndName(ItemMock, 'ORIGINAL')).toBeObservable(exprected$);
      });

      it('should return EMPTY if nothing where found', () => {
        const exprected$ = cold('(|)', {} );
        spyOn(bundleDataService, 'findByItemAndName').and.returnValue(observableOf(createFailedRemoteDataObject<Bundle>()));
        expect(service.findPrimaryBitstreamByItemAndName(ItemMock, 'ORIGINAL')).toBeObservable(exprected$);
      });
    });

    it('should be able to delete multiple bitstreams', () => {
      service.removeMultiple([bitstream1, bitstream2]);

      expect(requestService.send).toHaveBeenCalledWith(objectContaining({
        href: `${url}/bitstreams`,
        body: [
          { op: 'remove', path: '/bitstreams/fake-bitstream1' },
          { op: 'remove', path: '/bitstreams/fake-bitstream2' },
        ],
      } as PatchRequest));
      expect(service.invalidateByHref).toHaveBeenCalledWith('fake-bitstream1-self');
      expect(service.invalidateByHref).toHaveBeenCalledWith('fake-bitstream2-self');
    });
  });
});
