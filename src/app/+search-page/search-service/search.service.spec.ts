import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { SearchService } from './search.service';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { RequestService } from '../../core/data/request.service';
import { ResponseCacheService } from '../../core/cache/response-cache.service';
import { ActivatedRouteStub } from '../../shared/testing/active-router-stub';
import { RouterStub } from '../../shared/testing/router-stub';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { Observable } from 'rxjs/Observable';
import { PaginatedSearchOptions } from '../paginated-search-options.model';
import { RemoteData } from '../../core/data/remote-data';
import { ResponseCacheEntry } from '../../core/cache/response-cache.reducer';
import { RequestEntry } from '../../core/data/request.reducer';
import { getMockRequestService } from '../../shared/mocks/mock-request.service';
import { getMockResponseCacheService } from '../../shared/mocks/mock-response-cache.service';
import {
  FacetConfigSuccessResponse,
  SearchSuccessResponse
} from '../../core/cache/response-cache.models';
import { SearchQueryResponse } from './search-query-response.model';
import { SearchFilterConfig } from './search-filter-config.model';
import { CommunityDataService } from '../../core/data/community-data.service';
import { ViewMode } from '../../core/shared/view-mode.model';
import { PIDService } from '../../core/data/pid.service';

@Component({ template: '' })
class DummyComponent {
}

describe('SearchService', () => {
  describe('By default', () => {
    let searchService: SearchService;
    const router = new RouterStub();
    const route = new ActivatedRouteStub();
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          RouterTestingModule.withRoutes([
            { path: 'search', component: DummyComponent, pathMatch: 'full' },
          ])
        ],
        declarations: [
          DummyComponent
        ],
        providers: [
          { provide: Router, useValue: router },
          { provide: ActivatedRoute, useValue: route },
          { provide: ResponseCacheService, useValue: getMockResponseCacheService() },
          { provide: RequestService, useValue: getMockRequestService() },
          { provide: RemoteDataBuildService, useValue: {} },
          { provide: HALEndpointService, useValue: {} },
          { provide: CommunityDataService, useValue: {}},
          { provide: PIDService, useValue: {}},
          SearchService
        ],
      });
      searchService = TestBed.get(SearchService);
    });

    it('should return list view mode', () => {
      searchService.getViewMode().subscribe((viewMode) => {
        expect(viewMode).toBe(ViewMode.List);
      });
    });
  });
  describe('', () => {
    let searchService: SearchService;
    const router = new RouterStub();
    const route = new ActivatedRouteStub();

    const halService = {
      /* tslint:disable:no-empty */
      getEndpoint: () => {
      }
      /* tslint:enable:no-empty */

    };

    const remoteDataBuildService = {
      toRemoteDataObservable: (requestEntryObs: Observable<RequestEntry>, responseCacheObs: Observable<ResponseCacheEntry>, payloadObs: Observable<any>) => {
        return Observable.combineLatest(requestEntryObs,
          responseCacheObs, payloadObs, (req, res, pay) => {
            return { req, res, pay };
          });
      },
      aggregate: (input: Array<Observable<RemoteData<any>>>): Observable<RemoteData<any[]>> => {
        return Observable.of(new RemoteData(false, false, true, null, []));
      }
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          RouterTestingModule.withRoutes([
            { path: 'search', component: DummyComponent, pathMatch: 'full' },
          ])
        ],
        declarations: [
          DummyComponent
        ],
        providers: [
          { provide: Router, useValue: router },
          { provide: ActivatedRoute, useValue: route },
          { provide: ResponseCacheService, useValue: getMockResponseCacheService() },
          { provide: RequestService, useValue: getMockRequestService() },
          { provide: RemoteDataBuildService, useValue: remoteDataBuildService },
          { provide: HALEndpointService, useValue: halService },
          { provide: CommunityDataService, useValue: {}},
          { provide: PIDService, useValue: {}},
          SearchService
        ],
      });
      searchService = TestBed.get(SearchService);
      const urlTree = Object.assign(new UrlTree(), { root: { children: { primary: 'search' } } });
      router.parseUrl.and.returnValue(urlTree);
    });

    it('should call the navigate method on the Router with view mode list parameter as a parameter when setViewMode is called', () => {
      searchService.setViewMode(ViewMode.List);
      expect(router.navigate).toHaveBeenCalledWith(['/search'], {
        queryParams: { view: ViewMode.List },
        queryParamsHandling: 'merge'
      });
    });

    it('should call the navigate method on the Router with view mode grid parameter as a parameter when setViewMode is called', () => {
      searchService.setViewMode(ViewMode.Grid);
      expect(router.navigate).toHaveBeenCalledWith(['/search'], {
        queryParams: { view: ViewMode.Grid },
        queryParamsHandling: 'merge'
      });
    });

    it('should return ViewMode.List when the viewMode is set to ViewMode.List in the ActivatedRoute', () => {
      let viewMode = ViewMode.Grid;
      route.testParams = { view: ViewMode.List };
      searchService.getViewMode().subscribe((mode) => viewMode = mode);
      expect(viewMode).toEqual(ViewMode.List);
    });

    it('should return ViewMode.Grid when the viewMode is set to ViewMode.Grid in the ActivatedRoute', () => {
      let viewMode = ViewMode.List;
      route.testParams = { view: ViewMode.Grid };
      searchService.getViewMode().subscribe((mode) => viewMode = mode);
      expect(viewMode).toEqual(ViewMode.Grid);
    });

    describe('when search is called', () => {
      const endPoint = 'http://endpoint.com/test/test';
      const searchOptions = new PaginatedSearchOptions();
      const queryResponse = Object.assign(new SearchQueryResponse(), { objects: [] });
      const response = new SearchSuccessResponse(queryResponse, '200');
      const responseEntry = Object.assign(new ResponseCacheEntry(), { response: response });
      beforeEach(() => {
        spyOn((searchService as any).halService, 'getEndpoint').and.returnValue(Observable.of(endPoint));
        (searchService as any).responseCache.get.and.returnValue(Observable.of(responseEntry));
        /* tslint:disable:no-empty */
        searchService.search(searchOptions).subscribe((t) => {
        }); // subscribe to make sure all methods are called
        /* tslint:enable:no-empty */
      });

      it('should call getEndpoint on the halService', () => {
        expect((searchService as any).halService.getEndpoint).toHaveBeenCalled();
      });

      it('should send out the request on the request service', () => {
        expect((searchService as any).requestService.configure).toHaveBeenCalled();
      });

      it('should call getByHref on the request service with the correct request url', () => {
        expect((searchService as any).requestService.getByHref).toHaveBeenCalledWith(endPoint);
      });
      it('should call get on the request service with the correct request url', () => {
        expect((searchService as any).responseCache.get).toHaveBeenCalledWith(endPoint);
      });
    });

    describe('when getConfig is called without a scope', () => {
      const endPoint = 'http://endpoint.com/test/config';
      const filterConfig = [new SearchFilterConfig()];
      const response = new FacetConfigSuccessResponse(filterConfig, '200');
      const responseEntry = Object.assign(new ResponseCacheEntry(), { response: response });
      beforeEach(() => {
        spyOn((searchService as any).halService, 'getEndpoint').and.returnValue(Observable.of(endPoint));
        (searchService as any).responseCache.get.and.returnValue(Observable.of(responseEntry));
        /* tslint:disable:no-empty */
        searchService.getConfig(null).subscribe((t) => {
        }); // subscribe to make sure all methods are called
        /* tslint:enable:no-empty */
      });

      it('should call getEndpoint on the halService', () => {
        expect((searchService as any).halService.getEndpoint).toHaveBeenCalled();
      });

      it('should send out the request on the request service', () => {
        expect((searchService as any).requestService.configure).toHaveBeenCalled();
      });

      it('should call getByHref on the request service with the correct request url', () => {
        expect((searchService as any).requestService.getByHref).toHaveBeenCalledWith(endPoint);
      });
      it('should call get on the request service with the correct request url', () => {
        expect((searchService as any).responseCache.get).toHaveBeenCalledWith(endPoint);
      });
    });

    describe('when getConfig is called with a scope', () => {
      const endPoint = 'http://endpoint.com/test/config';
      const scope = 'test';
      const requestUrl = endPoint + '?scope=' + scope;
      const filterConfig = [new SearchFilterConfig()];
      const response = new FacetConfigSuccessResponse(filterConfig, '200');
      const responseEntry = Object.assign(new ResponseCacheEntry(), { response: response });
      beforeEach(() => {
        spyOn((searchService as any).halService, 'getEndpoint').and.returnValue(Observable.of(endPoint));
        (searchService as any).responseCache.get.and.returnValue(Observable.of(responseEntry));
        /* tslint:disable:no-empty */
        searchService.getConfig(scope).subscribe((t) => {
        }); // subscribe to make sure all methods are called
        /* tslint:enable:no-empty */
      });

      it('should call getEndpoint on the halService', () => {
        expect((searchService as any).halService.getEndpoint).toHaveBeenCalled();
      });

      it('should send out the request on the request service', () => {
        expect((searchService as any).requestService.configure).toHaveBeenCalled();
      });

      it('should call getByHref on the request service with the correct request url', () => {
        expect((searchService as any).requestService.getByHref).toHaveBeenCalledWith(requestUrl);
      });
      it('should call get on the request service with the correct request url', () => {
        expect((searchService as any).responseCache.get).toHaveBeenCalledWith(requestUrl);
      });
    });
  });
});
