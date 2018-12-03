import { TestBed } from '@angular/core/testing';
import { RegistryService } from './registry.service';
import { CommonModule } from '@angular/common';
import { ResponseCacheService } from '../cache/response-cache.service';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { Observable, of as observableOf, combineLatest as observableCombineLatest } from 'rxjs';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { RequestEntry } from '../data/request.reducer';
import { RemoteData } from '../data/remote-data';
import { PageInfo } from '../shared/page-info.model';
import { getMockRequestService } from '../../shared/mocks/mock-request.service';
import { getMockResponseCacheService } from '../../shared/mocks/mock-response-cache.service';

import {
  RegistryBitstreamformatsSuccessResponse,
  RegistryMetadatafieldsSuccessResponse,
  RegistryMetadataschemasSuccessResponse
} from '../cache/response-cache.models';
import { Component } from '@angular/core';
import { RegistryMetadataschemasResponse } from './registry-metadataschemas-response.model';
import { RegistryMetadatafieldsResponse } from './registry-metadatafields-response.model';
import { RegistryBitstreamformatsResponse } from './registry-bitstreamformats-response.model';
import { map } from 'rxjs/operators';

@Component({ template: '' })
class DummyComponent {
}

describe('RegistryService', () => {
  let registryService: RegistryService;
  const pagination: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'registry-service-spec-pagination',
    pageSize: 20
  });

  const mockSchemasList = [
    {
      id: 1,
      self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadataschemas/1',
      prefix: 'dc',
      namespace: 'http://dublincore.org/documents/dcmi-terms/'
    },
    {
      id: 2,
      self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadataschemas/2',
      prefix: 'mock',
      namespace: 'http://dspace.org/mockschema'
    }
  ];
  const mockFieldsList = [
    {
      self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/8',
      element: 'contributor',
      qualifier: 'advisor',
      scopenote: null,
      schema: mockSchemasList[0]
    },
    {
      self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/9',
      element: 'contributor',
      qualifier: 'author',
      scopenote: null,
      schema: mockSchemasList[0]
    },
    {
      self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/10',
      element: 'contributor',
      qualifier: 'editor',
      scopenote: 'test scope note',
      schema: mockSchemasList[1]
    },
    {
      self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/11',
      element: 'contributor',
      qualifier: 'illustrator',
      scopenote: null,
      schema: mockSchemasList[1]
    }
  ];
  const mockFormatsList = [
    {
      shortDescription: 'Unknown',
      description: 'Unknown data format',
      mimetype: 'application/octet-stream',
      supportLevel: 0,
      internal: false,
      extensions: null
    },
    {
      shortDescription: 'License',
      description: 'Item-specific license agreed upon to submission',
      mimetype: 'text/plain; charset=utf-8',
      supportLevel: 1,
      internal: true,
      extensions: null
    },
    {
      shortDescription: 'CC License',
      description: 'Item-specific Creative Commons license agreed upon to submission',
      mimetype: 'text/html; charset=utf-8',
      supportLevel: 2,
      internal: true,
      extensions: null
    },
    {
      shortDescription: 'Adobe PDF',
      description: 'Adobe Portable Document Format',
      mimetype: 'application/pdf',
      supportLevel: 0,
      internal: false,
      extensions: null
    }
  ];

  const pageInfo = new PageInfo();
  pageInfo.elementsPerPage = 20;
  pageInfo.currentPage = 1;

  const endpoint = 'path';
  const endpointWithParams = `${endpoint}?size=${pageInfo.elementsPerPage}&page=${pageInfo.currentPage - 1}`;

  const halServiceStub = {
    getEndpoint: (link: string) => observableOf(endpoint)
  };

  const rdbStub = {
    toRemoteDataObservable: (requestEntryObs: Observable<RequestEntry>, responseCacheObs: Observable<ResponseCacheEntry>, payloadObs: Observable<any>) => {
      return observableCombineLatest(requestEntryObs,
        responseCacheObs, payloadObs).pipe(map(([req, res, pay]) => {
          return { req, res, pay };
        })
      );
    },
    aggregate: (input: Array<Observable<RemoteData<any>>>): Observable<RemoteData<any[]>> => {
      return observableOf(new RemoteData(false, false, true, null, []));
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [
        DummyComponent
      ],
      providers: [
        { provide: ResponseCacheService, useValue: getMockResponseCacheService() },
        { provide: RequestService, useValue: getMockRequestService() },
        { provide: RemoteDataBuildService, useValue: rdbStub },
        { provide: HALEndpointService, useValue: halServiceStub },
        RegistryService
      ]
    });
    registryService = TestBed.get(RegistryService);

    spyOn((registryService as any).halService, 'getEndpoint').and.returnValue(observableOf(endpoint));
  });

  describe('when requesting metadataschemas', () => {
    const queryResponse = Object.assign(new RegistryMetadataschemasResponse(), {
      metadataschemas: mockSchemasList,
      page: pageInfo
    });
    const response = new RegistryMetadataschemasSuccessResponse(queryResponse, '200', pageInfo);
    const responseEntry = Object.assign(new ResponseCacheEntry(), { response: response });

    beforeEach(() => {
      (registryService as any).responseCache.get.and.returnValue(observableOf(responseEntry));
      /* tslint:disable:no-empty */
      registryService.getMetadataSchemas(pagination).subscribe((value) => {
      });
      /* tslint:enable:no-empty */
    });

    it('should call getEndpoint on the halService', () => {
      expect((registryService as any).halService.getEndpoint).toHaveBeenCalled();
    });

    it('should send out the request on the request service', () => {
      expect((registryService as any).requestService.configure).toHaveBeenCalled();
    });

    it('should call getByHref on the request service with the correct request url', () => {
      expect((registryService as any).requestService.getByHref).toHaveBeenCalledWith(endpointWithParams);
    });

    it('should call get on the request service with the correct request url', () => {
      expect((registryService as any).responseCache.get).toHaveBeenCalledWith(endpointWithParams);
    });
  });

  describe('when requesting metadataschema by name', () => {
    const queryResponse = Object.assign(new RegistryMetadataschemasResponse(), {
      metadataschemas: mockSchemasList,
      page: pageInfo
    });
    const response = new RegistryMetadataschemasSuccessResponse(queryResponse, '200', pageInfo);
    const responseEntry = Object.assign(new ResponseCacheEntry(), { response: response });

    beforeEach(() => {
      (registryService as any).responseCache.get.and.returnValue(observableOf(responseEntry));
      /* tslint:disable:no-empty */
      registryService.getMetadataSchemaByName(mockSchemasList[0].prefix).subscribe((value) => {
      });
      /* tslint:enable:no-empty */
    });

    it('should call getEndpoint on the halService', () => {
      expect((registryService as any).halService.getEndpoint).toHaveBeenCalled();
    });

    it('should send out the request on the request service', () => {
      expect((registryService as any).requestService.configure).toHaveBeenCalled();
    });

    it('should call getByHref on the request service with the correct request url', () => {
      expect((registryService as any).requestService.getByHref.calls.argsFor(0)[0]).toContain(endpoint);
    });

    it('should call get on the request service with the correct request url', () => {
      expect((registryService as any).responseCache.get.calls.argsFor(0)[0]).toContain(endpoint);
    });
  });

  describe('when requesting metadatafields', () => {
    const queryResponse = Object.assign(new RegistryMetadatafieldsResponse(), {
      metadatafields: mockFieldsList,
      page: pageInfo
    });
    const response = new RegistryMetadatafieldsSuccessResponse(queryResponse, '200', pageInfo);
    const responseEntry = Object.assign(new ResponseCacheEntry(), { response: response });

    beforeEach(() => {
      (registryService as any).responseCache.get.and.returnValue(observableOf(responseEntry));
      /* tslint:disable:no-empty */
      registryService.getMetadataFieldsBySchema(mockSchemasList[0], pagination).subscribe((value) => {
      });
      /* tslint:enable:no-empty */
    });

    it('should call getEndpoint on the halService', () => {
      expect((registryService as any).halService.getEndpoint).toHaveBeenCalled();
    });

    it('should send out the request on the request service', () => {
      expect((registryService as any).requestService.configure).toHaveBeenCalled();
    });

    it('should call getByHref on the request service with the correct request url', () => {
      expect((registryService as any).requestService.getByHref).toHaveBeenCalledWith(endpointWithParams);
    });

    it('should call get on the request service with the correct request url', () => {
      expect((registryService as any).responseCache.get).toHaveBeenCalledWith(endpointWithParams);
    });
  });

  describe('when requesting bitstreamformats', () => {
    const queryResponse = Object.assign(new RegistryBitstreamformatsResponse(), {
      bitstreamformats: mockFieldsList,
      page: pageInfo
    });
    const response = new RegistryBitstreamformatsSuccessResponse(queryResponse, '200', pageInfo);
    const responseEntry = Object.assign(new ResponseCacheEntry(), { response: response });

    beforeEach(() => {
      (registryService as any).responseCache.get.and.returnValue(observableOf(responseEntry));
      /* tslint:disable:no-empty */
      registryService.getBitstreamFormats(pagination).subscribe((value) => {
      });
      /* tslint:enable:no-empty */
    });

    it('should call getEndpoint on the halService', () => {
      expect((registryService as any).halService.getEndpoint).toHaveBeenCalled();
    });

    it('should send out the request on the request service', () => {
      expect((registryService as any).requestService.configure).toHaveBeenCalled();
    });

    it('should call getByHref on the request service with the correct request url', () => {
      expect((registryService as any).requestService.getByHref).toHaveBeenCalledWith(endpointWithParams);
    });

    it('should call get on the request service with the correct request url', () => {
      expect((registryService as any).responseCache.get).toHaveBeenCalledWith(endpointWithParams);
    });
  });
});
