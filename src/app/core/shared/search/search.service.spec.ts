import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SearchService } from './search.service';
import { Router, UrlTree } from '@angular/router';
import { RequestService } from '../../data/request.service';
import { ActivatedRouteStub } from '../../../shared/testing/active-router.stub';
import { RouterStub } from '../../../shared/testing/router.stub';
import { HALEndpointService } from '../hal-endpoint.service';
import { combineLatest as observableCombineLatest, Observable, of as observableOf } from 'rxjs';
import { PaginatedSearchOptions } from '../../../shared/search/paginated-search-options.model';
import { RemoteData } from '../../data/remote-data';
import { RequestEntry } from '../../data/request.reducer';
import { getMockRequestService } from '../../../shared/mocks/request.service.mock';
import { CommunityDataService } from '../../data/community-data.service';
import { ViewMode } from '../view-mode.model';
import { DSpaceObjectDataService } from '../../data/dspace-object-data.service';
import { map } from 'rxjs/operators';
import { RouteService } from '../../services/route.service';
import { routeServiceStub } from '../../../shared/testing/route-service.stub';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { SearchObjects } from '../../../shared/search/search-objects.model';
import { PaginationService } from '../../pagination/pagination.service';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../cache/models/sort-options.model';
import { FindListOptions } from '../../data/request.models';
import { SearchConfigurationService } from './search-configuration.service';
import { PaginationServiceStub } from '../../../shared/testing/pagination-service.stub';

@Component({ template: '' })
class DummyComponent {
}

describe('SearchService', () => {
  describe('By default', () => {
    let searchService: SearchService;
    const router = new RouterStub();
    const route = new ActivatedRouteStub();
    const searchConfigService = {paginationID: 'page-id'};
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
          { provide: RouteService, useValue: routeServiceStub },
          { provide: RequestService, useValue: getMockRequestService() },
          { provide: RemoteDataBuildService, useValue: {} },
          { provide: HALEndpointService, useValue: {} },
          { provide: CommunityDataService, useValue: {} },
          { provide: DSpaceObjectDataService, useValue: {} },
          { provide: PaginationService, useValue: {} },
          { provide: SearchConfigurationService, useValue: searchConfigService },
          SearchService
        ],
      });
      searchService = TestBed.inject(SearchService);
    });

    it('should return list view mode', () => {
      searchService.getViewMode().subscribe((viewMode) => {
        expect(viewMode).toBe(ViewMode.ListElement);
      });
    });
  });
  describe('', () => {
    let searchService: SearchService;
    const router = new RouterStub();
    let routeService;

    const halService = {
      /* tslint:disable:no-empty */
      getEndpoint: () => {
      }
      /* tslint:enable:no-empty */

    };

    const remoteDataBuildService = {
      toRemoteDataObservable: (requestEntryObs: Observable<RequestEntry>, payloadObs: Observable<any>) => {
        return observableCombineLatest([requestEntryObs, payloadObs]).pipe(
          map(([req, pay]) => {
            return { req, pay };
          })
        );
      },
      aggregate: (input: Observable<RemoteData<any>>[]): Observable<RemoteData<any[]>> => {
        return createSuccessfulRemoteDataObject$([]);
      },
      buildFromHref: (href: string): Observable<RemoteData<any>> => {
        return createSuccessfulRemoteDataObject$(Object.assign(new SearchObjects(), {
          page: []
        }));
      }
    };

    const paginationService = new PaginationServiceStub();
    const searchConfigService = {paginationID: 'page-id'};

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
          { provide: RouteService, useValue: routeServiceStub },
          { provide: RequestService, useValue: getMockRequestService() },
          { provide: RemoteDataBuildService, useValue: remoteDataBuildService },
          { provide: HALEndpointService, useValue: halService },
          { provide: CommunityDataService, useValue: {} },
          { provide: DSpaceObjectDataService, useValue: {} },
          { provide: PaginationService, useValue: paginationService },
          { provide: SearchConfigurationService, useValue: searchConfigService },
          SearchService
        ],
      });
      searchService = TestBed.inject(SearchService);
      routeService = TestBed.inject(RouteService);
      const urlTree = Object.assign(new UrlTree(), { root: { children: { primary: 'search' } } });
      router.parseUrl.and.returnValue(urlTree);
    });

    it('should call the navigate method on the Router with view mode list parameter as a parameter when setViewMode is called', () => {
      searchService.setViewMode(ViewMode.ListElement);
      expect(paginationService.updateRouteWithUrl).toHaveBeenCalledWith('page-id', ['/search'], {page: 1}, { view: ViewMode.ListElement }
      );
    });

    it('should call the navigate method on the Router with view mode grid parameter as a parameter when setViewMode is called', () => {
      searchService.setViewMode(ViewMode.GridElement);
      expect(paginationService.updateRouteWithUrl).toHaveBeenCalledWith('page-id', ['/search'], {page: 1}, { view: ViewMode.GridElement }
      );
    });

    it('should return ViewMode.List when the viewMode is set to ViewMode.List in the ActivatedRoute', () => {
      let viewMode = ViewMode.GridElement;
      spyOn(routeService, 'getQueryParamMap').and.returnValue(observableOf(new Map([
        ['view', ViewMode.ListElement],
      ])));

      searchService.getViewMode().subscribe((mode) => viewMode = mode);
      expect(viewMode).toEqual(ViewMode.ListElement);
    });

    it('should return ViewMode.Grid when the viewMode is set to ViewMode.Grid in the ActivatedRoute', () => {
      let viewMode = ViewMode.ListElement;
      spyOn(routeService, 'getQueryParamMap').and.returnValue(observableOf(new Map([
        ['view', ViewMode.GridElement],
      ])));
      searchService.getViewMode().subscribe((mode) => viewMode = mode);
      expect(viewMode).toEqual(ViewMode.GridElement);
    });

    describe('when search is called', () => {
      const endPoint = 'http://endpoint.com/test/test';
      const searchOptions = new PaginatedSearchOptions({});
      beforeEach(() => {
        spyOn((searchService as any).halService, 'getEndpoint').and.returnValue(observableOf(endPoint));
        spyOn((searchService as any).rdb, 'buildFromHref').and.callThrough();
        /* tslint:disable:no-empty */
        searchService.search(searchOptions).subscribe((t) => {
        }); // subscribe to make sure all methods are called
        /* tslint:enable:no-empty */
      });

      it('should call getEndpoint on the halService', () => {
        expect((searchService as any).halService.getEndpoint).toHaveBeenCalled();
      });

      it('should send out the request on the request service', () => {
        expect((searchService as any).requestService.send).toHaveBeenCalled();
      });

      it('should call getByHref on the request service with the correct request url', () => {
        expect((searchService as any).rdb.buildFromHref).toHaveBeenCalledWith(endPoint);
      });
    });

    describe('when getConfig is called without a scope', () => {
      const endPoint = 'http://endpoint.com/test/config';
      beforeEach(() => {
        spyOn((searchService as any).halService, 'getEndpoint').and.returnValue(observableOf(endPoint));
        spyOn((searchService as any).rdb, 'buildFromHref').and.callThrough();
        /* tslint:disable:no-empty */
        searchService.getConfig(null).subscribe((t) => {
        }); // subscribe to make sure all methods are called
        /* tslint:enable:no-empty */
      });

      it('should call getEndpoint on the halService', () => {
        expect((searchService as any).halService.getEndpoint).toHaveBeenCalled();
      });

      it('should send out the request on the request service', () => {
        expect((searchService as any).requestService.send).toHaveBeenCalled();
      });

      it('should call send containing a request with the correct request url', () => {
        expect((searchService as any).requestService.send).toHaveBeenCalledWith(jasmine.objectContaining({ href: endPoint }), true);
      });
    });

    describe('when getConfig is called with a scope', () => {
      const endPoint = 'http://endpoint.com/test/config';
      const scope = 'test';
      const requestUrl = endPoint + '?scope=' + scope;
      beforeEach(() => {
        spyOn((searchService as any).halService, 'getEndpoint').and.returnValue(observableOf(endPoint));
        /* tslint:disable:no-empty */
        searchService.getConfig(scope).subscribe((t) => {
        }); // subscribe to make sure all methods are called
        /* tslint:enable:no-empty */
      });

      it('should call getEndpoint on the halService', () => {
        expect((searchService as any).halService.getEndpoint).toHaveBeenCalled();
      });

      it('should send out the request on the request service', () => {
        expect((searchService as any).requestService.send).toHaveBeenCalled();
      });

      it('should call send containing a request with the correct request url', () => {
        expect((searchService as any).requestService.send).toHaveBeenCalledWith(jasmine.objectContaining({ href: requestUrl }), true);
      });
    });

    describe('when getSearchConfigurationFor is called without a scope', () => {
      const endPoint = 'http://endpoint.com/test/config';
      beforeEach(() => {
        spyOn((searchService as any).halService, 'getEndpoint').and.returnValue(observableOf(endPoint));
        spyOn((searchService as any).rdb, 'buildFromHref').and.callThrough();
        /* tslint:disable:no-empty */
        searchService.getSearchConfigurationFor(null).subscribe((t) => {
        }); // subscribe to make sure all methods are called
        /* tslint:enable:no-empty */
      });

      it('should call getEndpoint on the halService', () => {
        expect((searchService as any).halService.getEndpoint).toHaveBeenCalled();
      });

      it('should send out the request on the request service', () => {
        expect((searchService as any).requestService.send).toHaveBeenCalled();
      });

      it('should call send containing a request with the correct request url', () => {
        expect((searchService as any).requestService.send).toHaveBeenCalledWith(jasmine.objectContaining({ href: endPoint }), true);
      });
    });

    describe('when getSearchConfigurationFor is called with a scope', () => {
      const endPoint = 'http://endpoint.com/test/config';
      const scope = 'test';
      const requestUrl = endPoint + '?scope=' + scope;
      beforeEach(() => {
        spyOn((searchService as any).halService, 'getEndpoint').and.returnValue(observableOf(endPoint));
        /* tslint:disable:no-empty */
        searchService.getSearchConfigurationFor(scope).subscribe((t) => {
        }); // subscribe to make sure all methods are called
        /* tslint:enable:no-empty */
      });

      it('should call getEndpoint on the halService', () => {
        expect((searchService as any).halService.getEndpoint).toHaveBeenCalled();
      });

      it('should send out the request on the request service', () => {
        expect((searchService as any).requestService.send).toHaveBeenCalled();
      });

      it('should call send containing a request with the correct request url', () => {
        expect((searchService as any).requestService.send).toHaveBeenCalledWith(jasmine.objectContaining({ href: requestUrl }), true);
      });
    });

  });
});
