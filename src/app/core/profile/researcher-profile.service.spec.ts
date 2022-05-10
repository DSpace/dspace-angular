import { HttpClient, HttpHeaders } from '@angular/common/http';

import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RequestService } from '../data/request.service';
import { PageInfo } from '../shared/page-info.model';
import { buildPaginatedList } from '../data/paginated-list.model';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { RestResponse } from '../cache/response.models';
import { RequestEntry } from '../data/request-entry.model';
import { ResearcherProfileService } from './researcher-profile.service';
import { RouterMock } from '../../shared/mocks/router.mock';
import { ResearcherProfile } from './model/researcher-profile.model';
import { Item } from '../shared/item.model';
import { ReplaceOperation } from 'fast-json-patch';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { PostRequest } from '../data/request.models';

describe('ResearcherProfileService', () => {
  let scheduler: TestScheduler;
  let service: ResearcherProfileService;
  let serviceAsAny: any;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  let halService: HALEndpointService;
  let responseCacheEntry: RequestEntry;

  const researcherProfileId = 'beef9946-rt56-479e-8f11-b90cbe9f7241';
  const itemId = 'beef9946-rt56-479e-8f11-b90cbe9f7241';
  const researcherProfileItem: Item = Object.assign(new Item(), {
    id: itemId,
    _links: {
      self: {
        href: `https://rest.api/rest/api/items/${itemId}`
      },
    }
  });
  const researcherProfile: ResearcherProfile = Object.assign(new ResearcherProfile(), {
    id: researcherProfileId,
    visible: false,
    type: 'profile',
    _links: {
      item: {
        href: `https://rest.api/rest/api/profiles/${researcherProfileId}/item`
      },
      self: {
        href: `https://rest.api/rest/api/profiles/${researcherProfileId}`
      },
    }
  });

  const researcherProfilePatched: ResearcherProfile = Object.assign(new ResearcherProfile(), {
    id: researcherProfileId,
    visible: true,
    type: 'profile',
    _links: {
      item: {
        href: `https://rest.api/rest/api/profiles/${researcherProfileId}/item`
      },
      self: {
        href: `https://rest.api/rest/api/profiles/${researcherProfileId}`
      },
    }
  });

  const researcherProfileId2 = 'agbf9946-f4ce-479e-8f11-b90cbe9f7241';
  const anotherResearcherProfile: ResearcherProfile = Object.assign(new ResearcherProfile(), {
    id: researcherProfileId2,
    visible: false,
    type: 'profile',
    _links: {
      self: {
        href: `https://rest.api/rest/api/profiles/${researcherProfileId2}`
      },
    }
  });
  const endpointURL = `https://rest.api/rest/api/profiles`;
  const sourceUri = `https://rest.api/rest/api/external-source/profile`;
  const requestURL = `https://rest.api/rest/api/profiles/${researcherProfileId}`;
  const requestUUID = '8b3c613a-5a4b-438b-9686-be1d5b4a1c5a';

  const pageInfo = new PageInfo();
  const array = [researcherProfile, anotherResearcherProfile];
  const paginatedList = buildPaginatedList(pageInfo, array);
  const researcherProfileRD = createSuccessfulRemoteDataObject(researcherProfile);
  const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);

  beforeEach(() => {
    scheduler = getTestScheduler();

    halService = jasmine.createSpyObj('halService', {
      getEndpoint: cold('a', { a: endpointURL })
    });

    responseCacheEntry = new RequestEntry();
    responseCacheEntry.request = { href: 'https://rest.api/' } as any;
    responseCacheEntry.response = new RestResponse(true, 200, 'Success');

    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestUUID,
      send: true,
      removeByHrefSubstring: {},
      getByHref: observableOf(responseCacheEntry),
      getByUUID: observableOf(responseCacheEntry),
      setStaleByHrefSubstring: jasmine.createSpy('setStaleByHrefSubstring')
    });
    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: hot('a|', {
        a: researcherProfileRD
      }),
      buildList: hot('a|', {
        a: paginatedListRD
      }),
      buildFromRequestUUID: hot('a|', {
        a: researcherProfileRD
      })
    });
    objectCache = {} as ObjectCacheService;
    const notificationsService = {} as NotificationsService;
    const http = {} as HttpClient;
    const comparator = {} as any;
    const routerStub: any = new RouterMock();
    const itemService = jasmine.createSpyObj('ItemService', {
      findByHref: jasmine.createSpy('findByHref')
    });

    service = new ResearcherProfileService(
      requestService,
      rdbService,
      objectCache,
      halService,
      notificationsService,
      http,
      routerStub,
      comparator,
      itemService
    );
    serviceAsAny = service;

    spyOn((service as any).dataService, 'create').and.callThrough();
    spyOn((service as any).dataService, 'delete').and.callThrough();
    spyOn((service as any).dataService, 'update').and.callThrough();
    spyOn((service as any).dataService, 'findById').and.callThrough();
    spyOn((service as any).dataService, 'findByHref').and.callThrough();
    spyOn((service as any).dataService, 'searchBy').and.callThrough();
    spyOn((service as any).dataService, 'getLinkPath').and.returnValue(observableOf(endpointURL));

  });

  describe('findById', () => {
    it('should proxy the call to dataservice.findById with eperson UUID', () => {
      scheduler.schedule(() => service.findById(researcherProfileId));
      scheduler.flush();

      expect((service as any).dataService.findById).toHaveBeenCalledWith(researcherProfileId, true, true);
    });

    it('should return a ResearcherProfile object with the given id', () => {
      const result = service.findById(researcherProfileId);
      const expected = cold('a|', {
        a: researcherProfileRD
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('create', () => {
    it('should proxy the call to dataservice.create with eperson UUID', () => {
      scheduler.schedule(() => service.create());
      scheduler.flush();

      expect((service as any).dataService.create).toHaveBeenCalled();
    });

    it('should return the RemoteData<ResearcherProfile> created', () => {
      const result = service.create();
      const expected = cold('a|', {
        a: researcherProfileRD
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('delete', () => {
    it('should proxy the call to dataservice.delete', () => {
      scheduler.schedule(() => service.delete(researcherProfile));
      scheduler.flush();

      expect((service as any).dataService.delete).toHaveBeenCalledWith(researcherProfile.id);
    });
  });

  describe('findRelatedItemId', () => {
    describe('with a related item', () => {

      beforeEach(() => {
        (service as any).itemService.findByHref.and.returnValue(createSuccessfulRemoteDataObject$(researcherProfileItem));
      });

      it('should proxy the call to dataservice.findById with eperson UUID', () => {
        scheduler.schedule(() => service.findRelatedItemId(researcherProfile));
        scheduler.flush();

        expect((service as any).itemService.findByHref).toHaveBeenCalledWith(researcherProfile._links.item.href, false);
      });

      it('should return a ResearcherProfile object with the given id', () => {
        const result = service.findRelatedItemId(researcherProfile);
        const expected = cold('(a|)', {
          a: itemId
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('without a related item', () => {

      beforeEach(() => {
        (service as any).itemService.findByHref.and.returnValue(createSuccessfulRemoteDataObject$(null));
      });

      it('should proxy the call to dataservice.findById with eperson UUID', () => {
        scheduler.schedule(() => service.findRelatedItemId(researcherProfile));
        scheduler.flush();

        expect((service as any).itemService.findByHref).toHaveBeenCalledWith(researcherProfile._links.item.href, false);
      });

      it('should return a ResearcherProfile object with the given id', () => {
        const result = service.findRelatedItemId(researcherProfile);
        const expected = cold('(a|)', {
          a: undefined
        });
        expect(result).toBeObservable(expected);
      });
    });
  });

  describe('setVisibility', () => {
    let patchSpy;
    beforeEach(() => {
      spyOn((service as any), 'patch').and.returnValue(createSuccessfulRemoteDataObject$(researcherProfilePatched));
      spyOn((service as any), 'findById').and.returnValue(createSuccessfulRemoteDataObject$(researcherProfilePatched));
    });

    it('should proxy the call to dataservice.patch', () => {
      const replaceOperation: ReplaceOperation<boolean> = {
        path: '/visible',
        op: 'replace',
        value: true
      };

      scheduler.schedule(() => service.setVisibility(researcherProfile, true));
      scheduler.flush();

      expect((service as any).patch).toHaveBeenCalledWith(researcherProfile, [replaceOperation]);
    });
  });

  describe('createFromExternalSource', () => {
    let patchSpy;
    beforeEach(() => {
      spyOn((service as any), 'patch').and.returnValue(createSuccessfulRemoteDataObject$(researcherProfilePatched));
      spyOn((service as any), 'findById').and.returnValue(createSuccessfulRemoteDataObject$(researcherProfilePatched));
    });

    it('should proxy the call to dataservice.patch', () => {
      const options: HttpOptions = Object.create({});
      let headers = new HttpHeaders();
      headers = headers.append('Content-Type', 'text/uri-list');
      options.headers = headers;
      const request = new PostRequest(requestUUID, endpointURL, sourceUri, options);

      scheduler.schedule(() => service.createFromExternalSource(sourceUri));
      scheduler.flush();

      expect((service as any).requestService.send).toHaveBeenCalledWith(request);
      expect((service as any).rdbService.buildFromRequestUUID).toHaveBeenCalledWith(requestUUID);

    });
  });

});
