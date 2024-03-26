import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  Store,
  StoreModule,
} from '@ngrx/store';
import { createMockStore } from '@ngrx/store/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import {
  compare,
  Operation,
} from 'fast-json-patch';
import { of as observableOf } from 'rxjs';

import {
  GroupRegistryCancelGroupAction,
  GroupRegistryEditGroupAction,
} from '../../access-control/group-registry/group-registry.actions';
import { getMockObjectCacheService } from '../../shared/mocks/object-cache.service.mock';
import { getMockRemoteDataBuildServiceHrefMap } from '../../shared/mocks/remote-data-build.service.mock';
import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import {
  EPersonMock,
  EPersonMock2,
} from '../../shared/testing/eperson.mock';
import {
  GroupMock,
  GroupMock2,
} from '../../shared/testing/group-mock';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { TranslateLoaderMock } from '../../shared/testing/translate-loader.mock';
import {
  createPaginatedList,
  createRequestEntry$,
} from '../../shared/testing/utils.test';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheEntry } from '../cache/object-cache.reducer';
import { CoreState } from '../core-state.model';
import { ChangeAnalyzer } from '../data/change-analyzer';
import { FindListOptions } from '../data/find-list-options.model';
import {
  DeleteRequest,
  PostRequest,
} from '../data/request.models';
import { RequestService } from '../data/request.service';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { Item } from '../shared/item.model';
import { GroupDataService } from './group-data.service';

describe('GroupDataService', () => {
  let service: GroupDataService;
  let store: Store<CoreState>;
  let requestService: RequestService;

  let restEndpointURL;
  let groupsEndpoint;
  let groups;
  let groups$;
  let halService;
  let rdbService;
  let objectCache;
  function init() {
    restEndpointURL = 'https://rest.api/server/api/eperson';
    groupsEndpoint = `${restEndpointURL}/groups`;
    groups = [GroupMock, GroupMock2];
    groups$ = createSuccessfulRemoteDataObject$(createPaginatedList(groups));
    rdbService = getMockRemoteDataBuildServiceHrefMap(undefined, { 'https://rest.api/server/api/eperson/groups': groups$ });
    halService = new HALEndpointServiceStub(restEndpointURL);
    objectCache = getMockObjectCacheService();
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
      providers: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
  }

  function initTestService() {
    return new GroupDataService(
      requestService,
      rdbService,
      objectCache,
      halService,
      new DummyChangeAnalyzer() as any,
      null,
      null,
      store,
    );
  }

  beforeEach(() => {
    init();
    requestService = getMockRequestService(createRequestEntry$(groups));
    store = createMockStore({});
    service = initTestService();
    spyOn(store, 'dispatch');
    spyOn(rdbService, 'buildFromRequestUUIDAndAwait').and.callThrough();
  });

  describe('searchGroups', () => {
    beforeEach(() => {
      spyOn(service, 'searchBy');
    });

    it('search with empty query', () => {
      service.searchGroups('');
      const options = Object.assign(new FindListOptions(), {
        searchParams: [Object.assign(new RequestParam('query', ''))],
      });
      expect(service.searchBy).toHaveBeenCalledWith('byMetadata', options, true, true);
    });

    it('search with query', () => {
      service.searchGroups('test');
      const options = Object.assign(new FindListOptions(), {
        searchParams: [Object.assign(new RequestParam('query', 'test'))],
      });
      expect(service.searchBy).toHaveBeenCalledWith('byMetadata', options, true, true);
    });
  });

  describe('searchNonMemberGroups', () => {
    beforeEach(() => {
      spyOn(service, 'searchBy');
    });

    it('search with empty query and a group ID', () => {
      service.searchNonMemberGroups('', GroupMock.id);
      const options = Object.assign(new FindListOptions(), {
        searchParams: [Object.assign(new RequestParam('query', '')),
          Object.assign(new RequestParam('group', GroupMock.id))],
      });
      expect(service.searchBy).toHaveBeenCalledWith('isNotMemberOf', options, true, true);
    });

    it('search with query and a group ID', () => {
      service.searchNonMemberGroups('test', GroupMock.id);
      const options = Object.assign(new FindListOptions(), {
        searchParams: [Object.assign(new RequestParam('query', 'test')),
          Object.assign(new RequestParam('group', GroupMock.id))],
      });
      expect(service.searchBy).toHaveBeenCalledWith('isNotMemberOf', options, true, true);
    });
  });

  describe('addSubGroupToGroup', () => {
    beforeEach(() => {
      objectCache.getByHref.and.returnValue(observableOf({
        requestUUIDs: ['request1', 'request2'],
        dependentRequestUUIDs: [],
      } as ObjectCacheEntry));
      spyOn((service as any).deleteData, 'invalidateByHref');
      service.addSubGroupToGroup(GroupMock, GroupMock2).subscribe();
    });
    it('should send PostRequest to eperson/groups/group-id/subgroups endpoint with new subgroup link in body', () => {
      let headers = new HttpHeaders();
      const options: HttpOptions = Object.create({});
      headers = headers.append('Content-Type', 'text/uri-list');
      options.headers = headers;
      const expected = new PostRequest(requestService.generateRequestId(), GroupMock.self + '/' + service.subgroupsEndpoint, GroupMock2.self, options);
      expect(requestService.send).toHaveBeenCalledWith(expected);
    });
    it('should invalidate the previous requests of the parent group', () => {
      expect(rdbService.buildFromRequestUUIDAndAwait).toHaveBeenCalled();
      expect(rdbService.buildFromRequestUUIDAndAwait.calls.argsFor(0)[0]).toBe(requestService.generateRequestId());
      const callback = rdbService.buildFromRequestUUIDAndAwait.calls.argsFor(0)[1];
      callback();

      expect(objectCache.getByHref).toHaveBeenCalledWith(GroupMock._links.self.href);
      expect(requestService.setStaleByUUID).toHaveBeenCalledTimes(2);
      expect(requestService.setStaleByUUID).toHaveBeenCalledWith('request1');
      expect(requestService.setStaleByUUID).toHaveBeenCalledWith('request2');
    });
  });

  describe('deleteSubGroupFromGroup', () => {
    beforeEach(() => {
      objectCache.getByHref.and.returnValue(observableOf({
        requestUUIDs: ['request1', 'request2'],
        dependentRequestUUIDs: [],
      } as ObjectCacheEntry));
      spyOn((service as any).deleteData, 'invalidateByHref');
      service.deleteSubGroupFromGroup(GroupMock, GroupMock2).subscribe();
    });
    it('should send DeleteRequest to eperson/groups/group-id/subgroups/group-id endpoint', () => {
      const expected = new DeleteRequest(requestService.generateRequestId(), GroupMock.self + '/' + service.subgroupsEndpoint + '/' + GroupMock2.id);
      expect(requestService.send).toHaveBeenCalledWith(expected);
    });
    it('should invalidate the previous requests of the parent group\'', () => {
      expect(rdbService.buildFromRequestUUIDAndAwait).toHaveBeenCalled();
      expect(rdbService.buildFromRequestUUIDAndAwait.calls.argsFor(0)[0]).toBe(requestService.generateRequestId());
      const callback = rdbService.buildFromRequestUUIDAndAwait.calls.argsFor(0)[1];
      callback();

      expect(objectCache.getByHref).toHaveBeenCalledWith(GroupMock._links.self.href);
      expect(requestService.setStaleByUUID).toHaveBeenCalledTimes(2);
      expect(requestService.setStaleByUUID).toHaveBeenCalledWith('request1');
      expect(requestService.setStaleByUUID).toHaveBeenCalledWith('request2');
    });
  });

  describe('addMemberToGroup', () => {
    beforeEach(() => {
      objectCache.getByHref.and.returnValue(observableOf({
        requestUUIDs: ['request1', 'request2'],
        dependentRequestUUIDs: [],
      } as ObjectCacheEntry));
      spyOn((service as any).deleteData, 'invalidateByHref');
      service.addMemberToGroup(GroupMock, EPersonMock2).subscribe();
    });
    it('should send PostRequest to eperson/groups/group-id/epersons endpoint with new eperson member in body', () => {
      let headers = new HttpHeaders();
      const options: HttpOptions = Object.create({});
      headers = headers.append('Content-Type', 'text/uri-list');
      options.headers = headers;
      const expected = new PostRequest(requestService.generateRequestId(), GroupMock.self + '/' + service.ePersonsEndpoint, EPersonMock2.self, options);
      expect(requestService.send).toHaveBeenCalledWith(expected);
    });
    it('should invalidate the previous requests of the EPerson and the group', () => {
      expect(rdbService.buildFromRequestUUIDAndAwait).toHaveBeenCalled();
      expect(rdbService.buildFromRequestUUIDAndAwait.calls.argsFor(0)[0]).toBe(requestService.generateRequestId());
      const callback = rdbService.buildFromRequestUUIDAndAwait.calls.argsFor(0)[1];
      callback();

      expect(objectCache.getByHref).toHaveBeenCalledWith(EPersonMock2._links.self.href);
      expect(requestService.setStaleByUUID).toHaveBeenCalledTimes(2);
      expect(requestService.setStaleByUUID).toHaveBeenCalledWith('request2');
    });
  });

  describe('deleteMemberFromGroup', () => {
    beforeEach(() => {
      objectCache.getByHref.and.returnValue(observableOf({
        requestUUIDs: ['request1', 'request2'],
        dependentRequestUUIDs: [],
      } as ObjectCacheEntry));
      spyOn((service as any).deleteData, 'invalidateByHref');
      service.deleteMemberFromGroup(GroupMock, EPersonMock).subscribe();
    });
    it('should send DeleteRequest to eperson/groups/group-id/epersons/eperson-id endpoint', () => {
      const expected = new DeleteRequest(requestService.generateRequestId(), GroupMock.self + '/' + service.ePersonsEndpoint + '/' + EPersonMock.id);
      expect(requestService.send).toHaveBeenCalledWith(expected);
    });
    it('should invalidate the previous requests of the EPerson and the group', () => {
      expect(rdbService.buildFromRequestUUIDAndAwait).toHaveBeenCalled();
      expect(rdbService.buildFromRequestUUIDAndAwait.calls.argsFor(0)[0]).toBe(requestService.generateRequestId());
      const callback = rdbService.buildFromRequestUUIDAndAwait.calls.argsFor(0)[1];
      callback();

      expect(objectCache.getByHref).toHaveBeenCalledWith(EPersonMock._links.self.href);
      expect(requestService.setStaleByUUID).toHaveBeenCalledTimes(2);
      expect(requestService.setStaleByUUID).toHaveBeenCalledWith('request2');
    });
  });

  describe('editGroup', () => {
    it('should dispatch a EDIT_GROUP action with the group to start editing', () => {
      service.editGroup(GroupMock);
      expect(store.dispatch).toHaveBeenCalledWith(new GroupRegistryEditGroupAction(GroupMock));
    });
  });

  describe('cancelEditGroup', () => {
    it('should dispatch a CANCEL_EDIT_GROUP action', () => {
      service.cancelEditGroup();
      expect(store.dispatch).toHaveBeenCalledWith(new GroupRegistryCancelGroupAction());
    });
  });
});

class DummyChangeAnalyzer implements ChangeAnalyzer<Item> {
  diff(object1: Item, object2: Item): Operation[] {
    return compare((object1 as any).metadata, (object2 as any).metadata);
  }
}
