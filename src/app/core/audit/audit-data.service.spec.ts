import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  Store,
  StoreModule,
} from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { AuditMock } from '../../shared/testing/audit.mock';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import {
  createPaginatedList,
  createRequestEntry$,
} from '../../shared/testing/utils.test';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { RequestParam } from '../cache/models/request-param.model';
import { CoreState } from '../core-state.model';
import { FindListOptions } from '../data/find-list-options.model';
import { RequestService } from '../data/request.service';
import {
  AUDIT_FIND_BY_OBJECT_SEARCH_METHOD,
  AuditDataService,
} from './audit-data.service';

describe('AuditDataService', () => {
  let service: AuditDataService;
  let store: Store<CoreState>;
  let requestService: RequestService;

  let audit;
  let audits;

  let restEndpointURL;
  let auditsEndpoint;
  let halService: any;
  let paginatedAudits$;
  let audit$;

  function initTestService() {
    return new AuditDataService(
      requestService,
      null,
      null,
      halService,
      null,
      null,
    );
  }

  function init() {
    restEndpointURL = 'https://dspace.4science.it/dspace-spring-rest/api/system/auditevents';
    auditsEndpoint = `${restEndpointURL}/auditevents`;
    audit = AuditMock;
    audits = [AuditMock];
    audit$ = createSuccessfulRemoteDataObject$(audit);
    paginatedAudits$ = createSuccessfulRemoteDataObject$(createPaginatedList(audits));
    halService = new HALEndpointServiceStub(restEndpointURL);

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        StoreModule.forRoot({}),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ],
      providers: [
        provideMockStore(),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
  }

  beforeEach(() => {
    init();
    requestService = getMockRequestService(createRequestEntry$(audits));
    store = TestBed.inject(Store); // Use TestBed.inject to get the mock store
    service = initTestService();
    spyOn(store, 'dispatch');
  });

  describe('findByObject', () => {
    beforeEach(() => {
      spyOn((service as any).searchData, 'searchBy').and.returnValue(paginatedAudits$);
    });

    it('should call searchBy with the objectId and follow eperson link', (done) => {
      const objectId = 'objectId';
      const options = new FindListOptions();
      options.searchParams = [new RequestParam('object', objectId)];
      service.findByObject(objectId).subscribe((result) => {
        expect(result.payload.page).toEqual(audits);
        expect((service as any).searchData.searchBy).toHaveBeenCalledWith(
          AUDIT_FIND_BY_OBJECT_SEARCH_METHOD,
          options,
          true,
          true,
          followLink('eperson'),
        );
        done();
      });
    });
  });


  describe('findById', () => {
    beforeEach(() => {
      spyOn(service, 'findById').and.returnValue(audit$);
    });

    it('should call findById with id and linksToFollow', (done) => {
      const linksToFollow: any = 'linksToFollow';
      service.findById(audit.id, true, true, linksToFollow).subscribe((result) => {
        expect(result.payload).toEqual(audit);
        expect(service.findById).toHaveBeenCalledWith(audit.id, true, true, linksToFollow);
        done();
      });
    });
  });

  describe('findAll', () => {
    beforeEach(() => {
      spyOn((service as any).findAllData, 'findAll').and.returnValue(paginatedAudits$);
    });

    it('should call findAll with with paginated options and followLinks', (done) => {
      const linksToFollow: any = 'linksToFollow';
      const options = new FindListOptions();
      service.findAll(options, true, true, linksToFollow).subscribe((result) => {
        expect(result.payload.page).toEqual(audits);
        expect((service as any).findAllData.findAll).toHaveBeenCalledWith(options, true, true, linksToFollow);
        done();
      });
    });
  });

  describe('getOtherObject', () => {
    beforeEach(() => {
      spyOn(service, 'findByHref').and.returnValue(audit$);
    });

    it('should call findByHref it otherObjectHref exists', (done) => {
      spyOn(service, 'getOtherObjectHref').and.returnValue('otherObjectHref');
      service.getOtherObject(audit, 'contextObjectId').subscribe((result) => {
        expect(service.getOtherObjectHref).toHaveBeenCalledWith(audit, 'contextObjectId');
        expect(service.findByHref).toHaveBeenCalledWith('otherObjectHref');
        expect(result).toBe(audit);
        done();
      });
    });

    it('should return observable null if otherObjectHref not exists', (done) => {
      spyOn(service, 'getOtherObjectHref').and.returnValue(null);
      service.getOtherObject(audit, 'contextObjectId').subscribe((result) => {
        expect(service.getOtherObjectHref).toHaveBeenCalledWith(audit, 'contextObjectId');
        expect(service.findByHref).not.toHaveBeenCalled();
        expect(result).toBe(null);
        done();
      });
    });
  });

  describe('getOtherObjectHref', () => {

    it('should return the proper other object href if exists', () => {
      let otherObjectHref;
      let testAudit;
      const contextObject = 'contextObject';

      // if audit.objectUUID has no value return null
      testAudit = {
        objectUUID: null,
      };
      otherObjectHref = service.getOtherObjectHref(testAudit, contextObject);
      expect(otherObjectHref).toBe(null);

      // if contextObject equals to audit.objectUUID return subjectHref
      testAudit = {
        objectUUID: 'contextObject',
        subjectUUID: 'subjectUUID',
        _links: { subject: { href: 'subjectHref' } },
      };
      otherObjectHref = service.getOtherObjectHref(testAudit, contextObject);
      expect(otherObjectHref).toBe('subjectHref');

      // if contextObject equals to audit.subjectUUID return objectHref
      testAudit = {
        objectUUID: 'objectUUID',
        subjectUUID: 'contextObject',
        _links: { object: { href: 'objectHref' } },
      };
      otherObjectHref = service.getOtherObjectHref(testAudit, contextObject);
      expect(otherObjectHref).toBe('objectHref');

      // if contextObject not equals to audit.subjectUUID and audit.objectUUID return null;
      testAudit = {
        objectUUID: 'objectUUID',
        subjectUUID: 'subjectUUID',
        _links: { subject: { href: 'subjectHref' } },
      };
      otherObjectHref = service.getOtherObjectHref(testAudit, contextObject);
      expect(otherObjectHref).toBe(null);

    });
  });


});

