import { async, TestBed } from '@angular/core/testing';
import { RegistryService } from './registry.service';
import { CommonModule } from '@angular/common';
import { ResponseCacheService } from '../cache/response-cache.service';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { Observable } from 'rxjs/Observable';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { RequestEntry } from '../data/request.reducer';
import { RemoteData } from '../data/remote-data';
import { PaginatedList } from '../data/paginated-list';
import { PageInfo } from '../shared/page-info.model';

fdescribe('RegistryService', () => {
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
  pageInfo.elementsPerPage = 10;
  pageInfo.currentPage = 1;

  const halServiceStub = {
    getEndpoint: () => Observable.of('path')
  };

  const rdbMetadataschemasStub = {
    toRemoteDataObservable: () => {
      const payload = new PaginatedList(pageInfo, mockSchemasList);
      const remoteData = new RemoteData(false, false, true, undefined, payload);
      return Observable.of(remoteData);
    }
  };
  const rdbMetadatafieldsStub = {
    toRemoteDataObservable: () => {
      const payload = new PaginatedList(pageInfo, mockFieldsList);
      const remoteData = new RemoteData(false, false, true, undefined, payload);
      return Observable.of(remoteData);
    }
  };
  const rdbBitstreamformatsStub = {
    toRemoteDataObservable: () => {
      const payload = new PaginatedList(pageInfo, mockFormatsList);
      const remoteData = new RemoteData(false, false, true, undefined, payload);
      return Observable.of(remoteData);
    }
  };

  describe('when requesting metadataschemas', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ CommonModule ],
        providers: [
          { provide: ResponseCacheService, useValue: {} },
          { provide: RequestService, useValue: {} },
          { provide: RemoteDataBuildService, useValue: rdbMetadataschemasStub },
          { provide: HALEndpointService, useValue: halServiceStub },
          RegistryService
        ]
      });

      registryService = TestBed.get(RegistryService);
    });

    it('should recieve the correct data', () => {
      registryService.getMetadataSchemas(pagination).subscribe((value) => {
        expect(value.payload.page[0].prefix).toEqual('dc');
      });
    });
  });

  describe('when requesting metadatafields', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ CommonModule ],
        providers: [
          { provide: ResponseCacheService, useValue: {} },
          { provide: RequestService, useValue: {} },
          { provide: RemoteDataBuildService, useValue: rdbMetadatafieldsStub },
          { provide: HALEndpointService, useValue: halServiceStub },
          RegistryService
        ]
      });

      registryService = TestBed.get(RegistryService);
    });

    it('should recieve the correct data', () => {
      registryService.getMetadataFieldsBySchema(mockSchemasList[0], pagination).subscribe((value) => {
        expect(value.payload.page[0].element).toEqual('contributor');
      });
    });
  });

  describe('when requesting bitstreamformats', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ CommonModule ],
        providers: [
          { provide: ResponseCacheService, useValue: {} },
          { provide: RequestService, useValue: {} },
          { provide: RemoteDataBuildService, useValue: rdbBitstreamformatsStub },
          { provide: HALEndpointService, useValue: halServiceStub },
          RegistryService
        ]
      });

      registryService = TestBed.get(RegistryService);
    });

    it('should recieve the correct data', () => {
      registryService.getBitstreamFormats(pagination).subscribe((value) => {
        expect(value.payload.page[0].shortDescription).toEqual('Unknown');
      });
    });
  });
});
