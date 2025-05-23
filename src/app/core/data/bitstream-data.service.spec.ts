import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import {
  Observable,
  of,
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
import { RequestParam } from '../cache/models/request-param.model';
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
import { RestResponse } from '../cache/response.models';
import { RequestEntry } from './request-entry.model';

describe('BitstreamDataService', () => {
  let service: BitstreamDataService;
  let objectCache: ObjectCacheService;
  let requestService: RequestService;
  let halService: HALEndpointService;
  let bitstreamFormatService: BitstreamFormatDataService;
  let rdbService: RemoteDataBuildService;
  let bundleDataService: BundleDataService;
  const bitstreamFormatHref = 'rest-api/bitstreamformats';
  let responseCacheEntry: RequestEntry;

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
    responseCacheEntry = new RequestEntry();
    responseCacheEntry.request = { href: 'https://rest.api/' } as any;
    responseCacheEntry.response = new RestResponse(true, 200, 'Success');

    objectCache = jasmine.createSpyObj('objectCache', {
      remove: jasmine.createSpy('remove'),
      getByHref: of(responseCacheEntry),
    });
    requestService = getMockRequestService();
    halService = Object.assign(new HALEndpointServiceStub(url));
    bitstreamFormatService = jasmine.createSpyObj('bistreamFormatService', {
      getBrowseEndpoint: of(bitstreamFormatHref),
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
        const expected$ = cold('(a|)', { a: bitstream1 } );
        const bundle = Object.assign(new Bundle(), {
          primaryBitstream: of(createSuccessfulRemoteDataObject(bitstream1)),
        });
        spyOn(bundleDataService, 'findByItemAndName').and.returnValue(of(createSuccessfulRemoteDataObject(bundle)));
        expect(service.findPrimaryBitstreamByItemAndName(ItemMock, 'ORIGINAL')).toBeObservable(expected$);
      });

      it('should return null if primary bitstream has not be succeeded ', () => {
        const expected$ = cold('(a|)', { a: null } );
        const bundle = Object.assign(new Bundle(), {
          primaryBitstream: of(createFailedRemoteDataObject()),
        });
        spyOn(bundleDataService, 'findByItemAndName').and.returnValue(of(createSuccessfulRemoteDataObject(bundle)));
        expect(service.findPrimaryBitstreamByItemAndName(ItemMock, 'ORIGINAL')).toBeObservable(expected$);
      });

      it('should return EMPTY if nothing where found', () => {
        const expected$ = cold('(|)', {} );
        spyOn(bundleDataService, 'findByItemAndName').and.returnValue(of(createFailedRemoteDataObject<Bundle>()));
        expect(service.findPrimaryBitstreamByItemAndName(ItemMock, 'ORIGINAL')).toBeObservable(expected$);
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

  describe('findByItemHandle', () => {
    it('should encode the filename correctly in the search parameters', () => {
      const handle = '123456789/1234';
      const sequenceId = '5';
      const filename = 'file with spaces.pdf';
      const searchParams = [
        new RequestParam('handle', handle),
        new RequestParam('sequenceId', sequenceId),
        new RequestParam('filename', filename),
      ];
      const linksToFollow: FollowLinkConfig<Bitstream>[] = [];

      spyOn(service as any, 'getSearchByHref').and.callThrough();

      service.getSearchByHref('byItemHandle', { searchParams }, ...linksToFollow).subscribe((href) => {
        expect(service.getSearchByHref).toHaveBeenCalledWith(
          'byItemHandle',
          { searchParams },
          ...linksToFollow,
        );

        expect(href).toBe(`${url}/bitstreams/search/byItemHandle?handle=123456789%2F1234&sequenceId=5&filename=file%20with%20spaces.pdf`);
      });
    });
  });
});
