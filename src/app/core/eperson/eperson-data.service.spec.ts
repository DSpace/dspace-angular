import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { compare, Operation } from 'fast-json-patch';
import { getTestScheduler } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
import { TestScheduler } from 'rxjs/testing';
import { EPeopleRegistryCancelEPersonAction, EPeopleRegistryEditEPersonAction } from '../../+admin/admin-access-control/epeople-registry/epeople-registry.actions';
import { RequestParam } from '../cache/models/request-param.model';
import { CoreState } from '../core.reducers';
import { ChangeAnalyzer } from '../data/change-analyzer';
import { PaginatedList } from '../data/paginated-list';
import { RemoteData } from '../data/remote-data';
import { DeleteByIDRequest, FindListOptions, PatchRequest, PostRequest } from '../data/request.models';
import { RequestEntry } from '../data/request.reducer';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Item } from '../shared/item.model';
import { PageInfo } from '../shared/page-info.model';
import { EPersonDataService } from './eperson-data.service';
import { EPerson } from './models/eperson.model';
import { EPersonMock, EPersonMock2 } from '../../shared/testing/eperson.mock';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { getMockRemoteDataBuildServiceHrefMap } from '../../shared/mocks/remote-data-build.service.mock';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { getMockRequestService } from '../../shared/mocks/request.service.mock';

describe('EPersonDataService', () => {
  let service: EPersonDataService;
  let store: Store<CoreState>;
  let requestService: RequestService;
  let scheduler: TestScheduler;

  let epeople;

  let restEndpointURL;
  let epersonsEndpoint;
  let halService: any;
  let epeople$;
  let rdbService;

  let getRequestEntry$;

  function initTestService() {
    return new EPersonDataService(
      requestService,
      rdbService,
      store,
      null,
      halService,
      null,
      null,
      new DummyChangeAnalyzer() as any
    );
  }

  function init() {
    getRequestEntry$ = (successful: boolean) => {
      return observableOf({
        completed: true,
        response: { isSuccessful: successful, payload: epeople } as any
      } as RequestEntry)
    };
    restEndpointURL = 'https://dspace.4science.it/dspace-spring-rest/api/eperson';
    epersonsEndpoint = `${restEndpointURL}/epersons`;
    epeople = [EPersonMock, EPersonMock2];
    epeople$ = createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [epeople]));
    rdbService = getMockRemoteDataBuildServiceHrefMap(undefined, { 'https://dspace.4science.it/dspace-spring-rest/api/eperson/epersons': epeople$ });
    halService = new HALEndpointServiceStub(restEndpointURL);

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        StoreModule.forRoot({}),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
          useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [],
      providers: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  }

  beforeEach(() => {
    init();
    requestService = getMockRequestService(getRequestEntry$(true));
    store = new Store<CoreState>(undefined, undefined, undefined);
    service = initTestService();
    spyOn(store, 'dispatch');
  });

  describe('searchByScope', () => {
    beforeEach(() => {
      spyOn(service, 'searchBy');
    });

    it('search by default scope (byMetadata) and no query', () => {
      service.searchByScope(null, '');
      const options = Object.assign(new FindListOptions(), {
        searchParams: [Object.assign(new RequestParam('query', ''))]
      });
      expect(service.searchBy).toHaveBeenCalledWith('byMetadata', options);
    });

    it('search metadata scope and no query', () => {
      service.searchByScope('metadata', '');
      const options = Object.assign(new FindListOptions(), {
        searchParams: [Object.assign(new RequestParam('query', ''))]
      });
      expect(service.searchBy).toHaveBeenCalledWith('byMetadata', options);
    });

    it('search metadata scope and with query', () => {
      service.searchByScope('metadata', 'test');
      const options = Object.assign(new FindListOptions(), {
        searchParams: [Object.assign(new RequestParam('query', 'test'))]
      });
      expect(service.searchBy).toHaveBeenCalledWith('byMetadata', options);
    });

    it('search email scope and no query', () => {
      service.searchByScope('email', '');
      const options = Object.assign(new FindListOptions(), {
        searchParams: [Object.assign(new RequestParam('email', ''))]
      });
      expect(service.searchBy).toHaveBeenCalledWith('byEmail', options);
    });
  });

  describe('updateEPerson', () => {
    beforeEach(() => {
      spyOn(service, 'findByHref').and.returnValue(createSuccessfulRemoteDataObject$(EPersonMock));
    });

    describe('change Email', () => {
      const newEmail = 'changedemail@test.com';
      beforeEach(() => {
        const changedEPerson = Object.assign(new EPerson(), {
          id: EPersonMock.id,
          metadata: EPersonMock.metadata,
          email: newEmail,
          canLogIn: EPersonMock.canLogIn,
          requireCertificate: EPersonMock.requireCertificate,
          _links: EPersonMock._links,
        });
        service.updateEPerson(changedEPerson).subscribe();
      });
      it('should send PatchRequest with replace email operation', () => {
        const operations = [{ op: 'replace', path: '/email', value: newEmail }];
        const expected = new PatchRequest(requestService.generateRequestId(), epersonsEndpoint + '/' + EPersonMock.uuid, operations);
        expect(requestService.configure).toHaveBeenCalledWith(expected);
      });
    });

    describe('change certificate', () => {
      beforeEach(() => {
        const changedEPerson = Object.assign(new EPerson(), {
          id: EPersonMock.id,
          metadata: EPersonMock.metadata,
          email: EPersonMock.email,
          canLogIn: EPersonMock.canLogIn,
          requireCertificate: !EPersonMock.requireCertificate,
          _links: EPersonMock._links,
        });
        service.updateEPerson(changedEPerson).subscribe();
      });
      it('should send PatchRequest with replace certificate operation', () => {
        const operations = [{ op: 'replace', path: '/certificate', value: !EPersonMock.requireCertificate }];
        const expected = new PatchRequest(requestService.generateRequestId(), epersonsEndpoint + '/' + EPersonMock.uuid, operations);
        expect(requestService.configure).toHaveBeenCalledWith(expected);
      });
    });

    describe('change canLogin', () => {
      beforeEach(() => {
        const changedEPerson = Object.assign(new EPerson(), {
          id: EPersonMock.id,
          metadata: EPersonMock.metadata,
          email: EPersonMock.email,
          canLogIn: !EPersonMock.canLogIn,
          requireCertificate: EPersonMock.requireCertificate,
          _links: EPersonMock._links,
        });
        service.updateEPerson(changedEPerson).subscribe();
      });
      it('should send PatchRequest with replace canLogIn operation', () => {
        const operations = [{ op: 'replace', path: '/canLogIn', value: !EPersonMock.canLogIn }];
        const expected = new PatchRequest(requestService.generateRequestId(), epersonsEndpoint + '/' + EPersonMock.uuid, operations);
        expect(requestService.configure).toHaveBeenCalledWith(expected);
      });
    });

    describe('change name', () => {
      const newFirstName = 'changedFirst';
      const newLastName = 'changedLast';
      beforeEach(() => {
        const changedEPerson = Object.assign(new EPerson(), {
          id: EPersonMock.id,
          metadata: {
            'eperson.firstname': [
              {
                value: newFirstName,
              }
            ],
            'eperson.lastname': [
              {
                value: newLastName,
              },
            ],
          },
          email: EPersonMock.email,
          canLogIn: EPersonMock.canLogIn,
          requireCertificate: EPersonMock.requireCertificate,
          _links: EPersonMock._links,
        });
        service.updateEPerson(changedEPerson).subscribe();
      });
      it('should send PatchRequest with replace name metadata operations', () => {
        const operations = [
          { op: 'replace', path: '/eperson.lastname/0/value', value: newLastName },
          { op: 'replace', path: '/eperson.firstname/0/value', value: newFirstName }];
        const expected = new PatchRequest(requestService.generateRequestId(), epersonsEndpoint + '/' + EPersonMock.uuid, operations);
        expect(requestService.configure).toHaveBeenCalledWith(expected);
      });
    });
  });

  describe('clearEPersonRequests', () => {
    beforeEach(async(() => {
      scheduler = getTestScheduler();
      halService = {
        getEndpoint(linkPath: string): Observable<string> {
          return observableOf(restEndpointURL + '/' + linkPath);
        }
      } as HALEndpointService;
      initTestService();
      service.clearEPersonRequests();
    }));
    it('should remove the eperson hrefs in the request service', () => {
      expect(requestService.removeByHrefSubstring).toHaveBeenCalledWith(epersonsEndpoint);
    });
  });

  describe('getActiveEPerson', () => {
    it('should retrieve the ePerson currently getting edited, if any', () => {
      service.editEPerson(EPersonMock);

      service.getActiveEPerson().subscribe((activeEPerson: EPerson) => {
        expect(activeEPerson).toEqual(EPersonMock);
      })
    });

    it('should retrieve the ePerson currently getting edited, null if none being edited', () => {
      service.getActiveEPerson().subscribe((activeEPerson: EPerson) => {
        expect(activeEPerson).toEqual(null);
      })
    })
  });

  describe('cancelEditEPerson', () => {
    it('should dispatch a CANCEL_EDIT_EPERSON action', () => {
      service.cancelEditEPerson();
      expect(store.dispatch).toHaveBeenCalledWith(new EPeopleRegistryCancelEPersonAction());
    });
  });

  describe('editEPerson', () => {
    it('should dispatch a EDIT_EPERSON action with the EPerson to start editing', () => {
      service.editEPerson(EPersonMock);
      expect(store.dispatch).toHaveBeenCalledWith(new EPeopleRegistryEditEPersonAction(EPersonMock));
    });
  });

  describe('deleteEPerson', () => {
    beforeEach(() => {
      spyOn(service, 'findById').and.returnValue(getRemotedataObservable(EPersonMock));
      service.deleteEPerson(EPersonMock).subscribe();
    });

    it('should send DeleteRequest', () => {
      const expected = new DeleteByIDRequest(requestService.generateRequestId(), epersonsEndpoint + '/' + EPersonMock.uuid, EPersonMock.uuid);
      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });
  });

  describe('createEPersonForToken', () => {
    it('should sent a postRquest with an eperson to the token endpoint', () => {
      service.createEPersonForToken(EPersonMock, 'test-token');

      const expected = new PostRequest(requestService.generateRequestId(), epersonsEndpoint + '?token=test-token', EPersonMock);
      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });
  });
  describe('patchPasswordWithToken', () => {
    it('should sent a patch request with an uuid, token and new password to the epersons endpoint', () => {
      service.patchPasswordWithToken('test-uuid', 'test-token','test-password');

      const operation = Object.assign({ op: 'replace', path: '/password', value: 'test-password' });
      const expected = new PatchRequest(requestService.generateRequestId(), epersonsEndpoint + '/test-uuid?token=test-token', [operation]);

      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });
  });

});

function getRemotedataObservable(obj: any): Observable<RemoteData<any>> {
  return observableOf(new RemoteData(false, false, true, undefined, obj));
}

class DummyChangeAnalyzer implements ChangeAnalyzer<Item> {
  diff(object1: Item, object2: Item): Operation[] {
    return compare((object1 as any).metadata, (object2 as any).metadata);
  }
}
