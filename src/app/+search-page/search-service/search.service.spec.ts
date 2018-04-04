import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { SearchService } from './search.service';
import { ItemDataService } from './../../core/data/item-data.service';
import { ViewMode } from '../../+search-page/search-options.model';
import { RouteService } from '../../shared/route.service';
import { GLOBAL_CONFIG } from '../../../config';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../../core/data/request.service';
import { ResponseCacheService } from '../../core/cache/response-cache.service';
import { ActivatedRouteStub } from '../../shared/testing/active-router-stub';
import { RouterStub } from '../../shared/testing/router-stub';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';

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
          { provide: ResponseCacheService, useValue: {} },
          { provide: RequestService, useValue: {} },
          { provide: RemoteDataBuildService, useValue: {} },
          { provide: HALEndpointService, useValue: {} },
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
          { provide: ResponseCacheService, useValue: {} },
          { provide: RequestService, useValue: {} },
          { provide: RemoteDataBuildService, useValue: {} },
          { provide: HALEndpointService, useValue: {} },
          SearchService
        ],
      });
      searchService = TestBed.get(SearchService);
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
  });
});
