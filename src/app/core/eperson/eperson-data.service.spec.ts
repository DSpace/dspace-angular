import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { Store } from '@ngrx/store';
import {
  MockStore,
  provideMockStore,
} from '@ngrx/store/testing';
import {
  compare,
  Operation,
} from 'fast-json-patch';
import { cold } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';

import {
  EPeopleRegistryCancelEPersonAction,
  EPeopleRegistryEditEPersonAction,
} from '../../access-control/epeople-registry/epeople-registry.actions';
import { getMockRemoteDataBuildServiceHrefMap } from '../../shared/mocks/remote-data-build.service.mock';
import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import {
  createNoContentRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../../shared/remote-data.utils';
import {
  EPersonMock,
  EPersonMock2,
} from '../../shared/testing/eperson.mock';
import { GroupMock } from '../../shared/testing/group-mock';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import {
  createPaginatedList,
  createRequestEntry$,
} from '../../shared/testing/utils.test';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core-state.model';
import { ChangeAnalyzer } from '../data/change-analyzer';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';
import { FindListOptions } from '../data/find-list-options.model';
import {
  PatchRequest,
  PostRequest,
} from '../data/request.models';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Item } from '../shared/item.model';
import {
  editEPersonSelector,
  EPersonDataService,
} from './eperson-data.service';
import { EPerson } from './models/eperson.model';

describe('EPersonDataService', () => {
  let service: EPersonDataService;
  let store: MockStore<CoreState>;
  let requestService: RequestService;

  let epeople;

  let restEndpointURL;
  let epersonsEndpoint;
  let halService: any;
  let epeople$;
  let rdbService;

  const initialState = {
    epeopleRegistry: {
      editEPerson: null,
    },
  };

  beforeEach(waitForAsync(() => {
    restEndpointURL = 'https://rest.api/dspace-spring-rest/api/eperson';
    epersonsEndpoint = `${restEndpointURL}/epersons`;
    epeople = [EPersonMock, EPersonMock2];
    epeople$ = createSuccessfulRemoteDataObject$(createPaginatedList([epeople]));
    rdbService = getMockRemoteDataBuildServiceHrefMap(undefined, { 'https://rest.api/dspace-spring-rest/api/eperson/epersons': epeople$ });
    halService = new HALEndpointServiceStub(restEndpointURL);
    requestService = getMockRequestService(createRequestEntry$(epeople));

    TestBed.configureTestingModule({
      providers: [
        EPersonDataService,
        { provide: RequestService, useValue: requestService },
        { provide: RemoteDataBuildService, useValue: rdbService },
        { provide: HALEndpointService, useValue: halService },
        provideMockStore({ initialState }),
        { provide: ObjectCacheService, useValue: {} },
        { provide: DSOChangeAnalyzer, useClass: DummyChangeAnalyzer },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    service = TestBed.inject(EPersonDataService);
    store = TestBed.inject(Store) as MockStore<CoreState>;
    spyOn(store, 'dispatch').and.callThrough();
  }));

  describe('searchByScope', () => {
    beforeEach(() => {
      spyOn(service, 'searchBy');
    });

    it('search by default scope (byMetadata) and no query', () => {
      service.searchByScope(null, '');
      const options = Object.assign(new FindListOptions(), {
        searchParams: [Object.assign(new RequestParam('query', ''))],
      });
      expect(service.searchBy).toHaveBeenCalledWith('byMetadata', options, true, true);
    });

    it('search metadata scope and no query', () => {
      service.searchByScope('metadata', '');
      const options = Object.assign(new FindListOptions(), {
        searchParams: [Object.assign(new RequestParam('query', ''))],
      });
      expect(service.searchBy).toHaveBeenCalledWith('byMetadata', options, true, true);
    });

    it('search metadata scope and with query', () => {
      service.searchByScope('metadata', 'test');
      const options = Object.assign(new FindListOptions(), {
        searchParams: [Object.assign(new RequestParam('query', 'test'))],
      });
      expect(service.searchBy).toHaveBeenCalledWith('byMetadata', options, true, true);
    });

    it('search email scope and no query', () => {
      spyOn((service as any).searchData, 'getSearchByHref').and.returnValue(epersonsEndpoint);
      spyOn(service, 'findByHref').and.returnValue(createSuccessfulRemoteDataObject$(null));
      service.searchByScope('email', '');
      const options = Object.assign(new FindListOptions(), {
        searchParams: [Object.assign(new RequestParam('email', ''))],
      });
      expect((service as any).searchData.getSearchByHref).toHaveBeenCalledWith('byEmail', options);
      expect(service.findByHref).toHaveBeenCalledWith(epersonsEndpoint, true, true);
    });

    it('search email scope with a query', () => {
      spyOn((service as any).searchData, 'getSearchByHref').and.returnValue(epersonsEndpoint);
      spyOn(service, 'findByHref').and.returnValue(createSuccessfulRemoteDataObject$(EPersonMock));
      service.searchByScope('email', EPersonMock.email);
      const options = Object.assign(new FindListOptions(), {
        searchParams: [Object.assign(new RequestParam('email', EPersonMock.email))],
      });
      expect((service as any).searchData.getSearchByHref).toHaveBeenCalledWith('byEmail', options);
      expect(service.findByHref).toHaveBeenCalledWith(epersonsEndpoint, true, true);
    });
  });

  describe('searchNonMembers', () => {
    beforeEach(() => {
      spyOn(service, 'searchBy');
    });

    it('search with empty query and a group ID', () => {
      service.searchNonMembers('', GroupMock.id);
      const options = Object.assign(new FindListOptions(), {
        searchParams: [Object.assign(new RequestParam('query', '')),
          Object.assign(new RequestParam('group', GroupMock.id))],
      });
      expect(service.searchBy).toHaveBeenCalledWith('isNotMemberOf', options, true, true);
    });

    it('search with query and a group ID', () => {
      service.searchNonMembers('test', GroupMock.id);
      const options = Object.assign(new FindListOptions(), {
        searchParams: [Object.assign(new RequestParam('query', 'test')),
          Object.assign(new RequestParam('group', GroupMock.id))],
      });
      expect(service.searchBy).toHaveBeenCalledWith('isNotMemberOf', options, true, true);
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
        expect(requestService.send).toHaveBeenCalledWith(expected);
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
        expect(requestService.send).toHaveBeenCalledWith(expected);
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
        expect(requestService.send).toHaveBeenCalledWith(expected);
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
              },
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
        expect(requestService.send).toHaveBeenCalledWith(expected);
      });
    });
  });

  describe('clearEPersonRequests', () => {
    beforeEach(() => {
      spyOn(halService, 'getEndpoint').and.callFake((linkPath: string) => {
        return observableOf(`${restEndpointURL}/${linkPath}`);
      });
    });
    it('should remove the eperson hrefs in the request service', fakeAsync(() => {
      service.clearEPersonRequests();
      tick();

      expect(requestService.removeByHrefSubstring).toHaveBeenCalledWith(epersonsEndpoint);
    }));
  });

  describe('getActiveEPerson', () => {
    it('should retrieve the ePerson currently getting edited, if any', () => {
      // Update the state with the ePerson (the provideMockStore doesn't update itself when dispatch is called)
      store.overrideSelector(editEPersonSelector, EPersonMock);

      expect(service.getActiveEPerson()).toBeObservable(cold('a', { a: EPersonMock }));
    });

    it('should retrieve the ePerson currently getting edited, null if none being edited', () => {
      expect(service.getActiveEPerson()).toBeObservable(cold('a', { a: null }));
    });
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
      spyOn(service, 'delete').and.returnValue(createNoContentRemoteDataObject$());
      service.deleteEPerson(EPersonMock).subscribe();
    });

    it('should call UpdateDataServiceImpl.delete with the EPerson\'s UUID', () => {
      expect(service.delete).toHaveBeenCalledWith(EPersonMock.id);
    });
  });

  describe('createEPersonForToken', () => {
    it('should sent a postRquest with an eperson to the token endpoint', () => {
      service.createEPersonForToken(EPersonMock, 'test-token');

      const expected = new PostRequest(requestService.generateRequestId(), epersonsEndpoint + '?token=test-token', EPersonMock);
      expect(requestService.send).toHaveBeenCalledWith(expected);
    });
  });
  describe('patchPasswordWithToken', () => {
    it('should sent a patch request with an uuid, token and new password to the epersons endpoint', () => {
      service.patchPasswordWithToken('test-uuid', 'test-token', 'test-password');

      const operation = Object.assign({ op: 'add', path: '/password', value: { new_password: 'test-password' } });
      const expected = new PatchRequest(requestService.generateRequestId(), epersonsEndpoint + '/test-uuid?token=test-token', [operation]);

      expect(requestService.send).toHaveBeenCalledWith(expected);
    });
  });

});

class DummyChangeAnalyzer implements ChangeAnalyzer<Item> {
  diff(object1: Item, object2: Item): Operation[] {
    return compare((object1 as any).metadata, (object2 as any).metadata);
  }
}
