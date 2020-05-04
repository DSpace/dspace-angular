import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { combineLatest as observableCombineLatest, Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  MetadataRegistryCancelFieldAction,
  MetadataRegistryCancelSchemaAction,
  MetadataRegistryDeselectAllFieldAction,
  MetadataRegistryDeselectAllSchemaAction,
  MetadataRegistryDeselectFieldAction,
  MetadataRegistryDeselectSchemaAction,
  MetadataRegistryEditFieldAction,
  MetadataRegistryEditSchemaAction,
  MetadataRegistrySelectFieldAction,
  MetadataRegistrySelectSchemaAction
} from '../../+admin/admin-registries/metadata-registry/metadata-registry.actions';
import { getMockRequestService } from '../../shared/mocks/mock-request.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { MockStore } from '../../shared/testing/mock-store';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service-stub';
import { createSuccessfulRemoteDataObject$ } from '../../shared/testing/utils';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';

import {
  RegistryMetadatafieldsSuccessResponse,
  RegistryMetadataschemasSuccessResponse,
  RestResponse
} from '../cache/response.models';
import { RemoteData } from '../data/remote-data';
import { RequestEntry } from '../data/request.reducer';
import { RequestService } from '../data/request.service';
import { MetadataField } from '../metadata/metadata-field.model';
import { MetadataSchema } from '../metadata/metadata-schema.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { PageInfo } from '../shared/page-info.model';
import { RegistryMetadatafieldsResponse } from './registry-metadatafields-response.model';
import { RegistryMetadataschemasResponse } from './registry-metadataschemas-response.model';
import { RegistryService } from './registry.service';

@Component({ template: '' })
class DummyComponent {
}

describe('RegistryService', () => {
  let registryService: RegistryService;
  let mockStore;
  const pagination: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'registry-service-spec-pagination',
    pageSize: 20
  });

  const mockSchemasList = [
    Object.assign(new MetadataSchema(), {
      id: 1,
      _links: {
        self: { href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadataschemas/1' }
      },
      prefix: 'dc',
      namespace: 'http://dublincore.org/documents/dcmi-terms/',
      type: MetadataSchema.type
    }),
    Object.assign(new MetadataSchema(), {
      id: 2,
      _links: {
        self: { href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadataschemas/2' }
      },
      prefix: 'mock',
      namespace: 'http://dspace.org/mockschema',
      type: MetadataSchema.type
    })
  ];
  const mockFieldsList = [
    Object.assign(new MetadataField(),
      {
        id: 1,
        _links: {
          self: { href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/8' }
        },
        element: 'contributor',
        qualifier: 'advisor',
        scopeNote: null,
        schema: mockSchemasList[0],
        type: MetadataField.type
      }),
    Object.assign(new MetadataField(),
      {
        id: 2,
        _links: {
          self: { href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/9' }
        },
        element: 'contributor',
        qualifier: 'author',
        scopeNote: null,
        schema: mockSchemasList[0],
        type: MetadataField.type
      }),
    Object.assign(new MetadataField(),
      {
        id: 3,
        _links: {
          self: { href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/10' }
        },
        element: 'contributor',
        qualifier: 'editor',
        scopeNote: 'test scope note',
        schema: mockSchemasList[1],
        type: MetadataField.type
      }),
    Object.assign(new MetadataField(),
      {
        id: 4,
        _links: {
          self: { href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/metadatafields/11' }
        },
        element: 'contributor',
        qualifier: 'illustrator',
        scopeNote: null,
        schema: mockSchemasList[1],
        type: MetadataField.type
      })
  ];

  const pageInfo = new PageInfo();
  pageInfo.elementsPerPage = 20;
  pageInfo.currentPage = 1;

  const endpoint = 'path';
  const endpointWithParams = `${endpoint}?size=${pageInfo.elementsPerPage}&page=${pageInfo.currentPage - 1}`;
  const fieldEndpointWithParams = `${endpoint}?schema=${mockSchemasList[0].prefix}&size=${pageInfo.elementsPerPage}&page=${pageInfo.currentPage - 1}`;

  const halServiceStub = {
    getEndpoint: (link: string) => observableOf(endpoint)
  };

  const rdbStub = {
    toRemoteDataObservable: (requestEntryObs: Observable<RequestEntry>, payloadObs: Observable<any>) => {
      return observableCombineLatest(requestEntryObs,
        payloadObs).pipe(map(([req, pay]) => {
          return { req, pay };
        })
      );
    },
    aggregate: (input: Array<Observable<RemoteData<any>>>): Observable<RemoteData<any[]>> => {
      return createSuccessfulRemoteDataObject$([]);
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, StoreModule.forRoot({}), TranslateModule.forRoot()],
      declarations: [
        DummyComponent
      ],
      providers: [
        { provide: RequestService, useValue: getMockRequestService() },
        { provide: RemoteDataBuildService, useValue: rdbStub },
        { provide: HALEndpointService, useValue: halServiceStub },
        { provide: Store, useClass: MockStore },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        RegistryService
      ]
    });
    registryService = TestBed.get(RegistryService);
    mockStore = TestBed.get(Store);
    spyOn((registryService as any).halService, 'getEndpoint').and.returnValue(observableOf(endpoint));
  });

  describe('when requesting metadataschemas', () => {
    const queryResponse = Object.assign(new RegistryMetadataschemasResponse(), {
      metadataschemas: mockSchemasList,
      page: pageInfo
    });
    const response = new RegistryMetadataschemasSuccessResponse(queryResponse, 200, 'OK', pageInfo);
    const responseEntry = Object.assign(new RequestEntry(), { response: response });

    beforeEach(() => {
      (registryService as any).requestService.getByHref.and.returnValue(observableOf(responseEntry));
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
  });

  describe('when requesting metadataschema by name', () => {
    const queryResponse = Object.assign(new RegistryMetadataschemasResponse(), {
      metadataschemas: mockSchemasList,
      page: pageInfo
    });
    const response = new RegistryMetadataschemasSuccessResponse(queryResponse, 200, 'OK', pageInfo);
    const responseEntry = Object.assign(new RequestEntry(), { response: response });

    beforeEach(() => {
      (registryService as any).requestService.getByHref.and.returnValue(observableOf(responseEntry));
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
  });

  describe('when requesting metadatafields', () => {
    const queryResponse = Object.assign(new RegistryMetadatafieldsResponse(), {
      metadatafields: mockFieldsList,
      page: pageInfo
    });
    const response = new RegistryMetadatafieldsSuccessResponse(queryResponse, 200, 'OK', pageInfo);
    const responseEntry = Object.assign(new RequestEntry(), { response: response });

    beforeEach(() => {
      (registryService as any).requestService.getByHref.and.returnValue(observableOf(responseEntry));
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
      expect((registryService as any).requestService.getByHref).toHaveBeenCalledWith(fieldEndpointWithParams);
    });
  });

  describe('when dispatching to the store', () => {
    beforeEach(() => {
      spyOn(mockStore, 'dispatch');
    });

    describe('when calling editMetadataSchema', () => {
      beforeEach(() => {
        registryService.editMetadataSchema(mockSchemasList[0]);
      });

      it('should dispatch a MetadataRegistryEditSchemaAction with the correct schema', () => {
        expect(mockStore.dispatch).toHaveBeenCalledWith(new MetadataRegistryEditSchemaAction(mockSchemasList[0]));
      });
    });

    describe('when calling cancelEditMetadataSchema', () => {
      beforeEach(() => {
        registryService.cancelEditMetadataSchema();
      });

      it('should dispatch a MetadataRegistryCancelSchemaAction', () => {
        expect(mockStore.dispatch).toHaveBeenCalledWith(new MetadataRegistryCancelSchemaAction());
      });
    });

    describe('when calling selectMetadataSchema', () => {
      beforeEach(() => {
        registryService.selectMetadataSchema(mockSchemasList[0]);
      });

      it('should dispatch a MetadataRegistrySelectSchemaAction with the correct schema', () => {
        expect(mockStore.dispatch).toHaveBeenCalledWith(new MetadataRegistrySelectSchemaAction(mockSchemasList[0]));
      });
    });

    describe('when calling deselectMetadataSchema', () => {
      beforeEach(() => {
        registryService.deselectMetadataSchema(mockSchemasList[0]);
      });

      it('should dispatch a MetadataRegistryDeselectSchemaAction with the correct schema', () => {
        expect(mockStore.dispatch).toHaveBeenCalledWith(new MetadataRegistryDeselectSchemaAction(mockSchemasList[0]));
      });
    });

    describe('when calling deselectAllMetadataSchema', () => {
      beforeEach(() => {
        registryService.deselectAllMetadataSchema();
      });

      it('should dispatch a MetadataRegistryDeselectAllSchemaAction', () => {
        expect(mockStore.dispatch).toHaveBeenCalledWith(new MetadataRegistryDeselectAllSchemaAction());
      });
    });

    describe('when calling editMetadataField', () => {
      beforeEach(() => {
        registryService.editMetadataField(mockFieldsList[0]);
      });

      it('should dispatch a MetadataRegistryEditFieldAction with the correct Field', () => {
        expect(mockStore.dispatch).toHaveBeenCalledWith(new MetadataRegistryEditFieldAction(mockFieldsList[0]));
      });
    });

    describe('when calling cancelEditMetadataField', () => {
      beforeEach(() => {
        registryService.cancelEditMetadataField();
      });

      it('should dispatch a MetadataRegistryCancelFieldAction', () => {
        expect(mockStore.dispatch).toHaveBeenCalledWith(new MetadataRegistryCancelFieldAction());
      });
    });

    describe('when calling selectMetadataField', () => {
      beforeEach(() => {
        registryService.selectMetadataField(mockFieldsList[0]);
      });

      it('should dispatch a MetadataRegistrySelectFieldAction with the correct Field', () => {
        expect(mockStore.dispatch).toHaveBeenCalledWith(new MetadataRegistrySelectFieldAction(mockFieldsList[0]));
      });
    });

    describe('when calling deselectMetadataField', () => {
      beforeEach(() => {
        registryService.deselectMetadataField(mockFieldsList[0]);
      });

      it('should dispatch a MetadataRegistryDeselectFieldAction with the correct Field', () => {
        expect(mockStore.dispatch).toHaveBeenCalledWith(new MetadataRegistryDeselectFieldAction(mockFieldsList[0]));
      });
    });

    describe('when calling deselectAllMetadataField', () => {
      beforeEach(() => {
        registryService.deselectAllMetadataField();
      });

      it('should dispatch a MetadataRegistryDeselectAllFieldAction', () => {
        expect(mockStore.dispatch).toHaveBeenCalledWith(new MetadataRegistryDeselectAllFieldAction());
      });
    });
  });

  describe('when createOrUpdateMetadataSchema is called', () => {
    let result: Observable<MetadataSchema>;

    beforeEach(() => {
      result = registryService.createOrUpdateMetadataSchema(mockSchemasList[0]);
    });

    it('should return the created/updated metadata schema', () => {
      result.subscribe((schema: MetadataSchema) => {
        expect(schema).toEqual(mockSchemasList[0]);
      });
    });
  });

  describe('when createOrUpdateMetadataField is called', () => {
    let result: Observable<MetadataField>;

    beforeEach(() => {
      result = registryService.createOrUpdateMetadataField(mockFieldsList[0]);
    });

    it('should return the created/updated metadata field', () => {
      result.subscribe((field: MetadataField) => {
        expect(field).toEqual(mockFieldsList[0]);
      });
    });
  });

  describe('when deleteMetadataSchema is called', () => {
    let result: Observable<RestResponse>;

    beforeEach(() => {
      result = registryService.deleteMetadataSchema(mockSchemasList[0].id);
    });

    it('should return a successful response', () => {
      result.subscribe((response: RestResponse) => {
        expect(response.isSuccessful).toBe(true);
      });
    });
  });

  describe('when deleteMetadataField is called', () => {
    let result: Observable<RestResponse>;

    beforeEach(() => {
      result = registryService.deleteMetadataField(mockFieldsList[0].id);
    });

    it('should return a successful response', () => {
      result.subscribe((response: RestResponse) => {
        expect(response.isSuccessful).toBe(true);
      });
    });
  });

  describe('when clearMetadataSchemaRequests is called', () => {
    beforeEach(() => {
      registryService.clearMetadataSchemaRequests().subscribe();
    });

    it('should remove the requests related to metadata schemas from cache', () => {
      expect((registryService as any).requestService.removeByHrefSubstring).toHaveBeenCalled();
    });
  });

  describe('when clearMetadataFieldRequests is called', () => {
    beforeEach(() => {
      registryService.clearMetadataFieldRequests().subscribe();
    });

    it('should remove the requests related to metadata fields from cache', () => {
      expect((registryService as any).requestService.removeByHrefSubstring).toHaveBeenCalled();
    });
  });
});
