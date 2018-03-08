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
import { ActivatedRoute } from '@angular/router';
import { RequestService } from '../../core/data/request.service';
import { ResponseCacheService } from '../../core/cache/response-cache.service';
import { ActivatedRouteStub } from '../../shared/testing/active-router-stub';

@Component({ template: '' })
class DummyComponent { }

describe('SearchService', () => {
  let searchService: SearchService;

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
        { provide: ItemDataService, useValue: {} },
        { provide: RouteService, useValue: {} },
        { provide: ResponseCacheService, useValue: {} },
        { provide: RequestService, useValue: {} },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: RemoteDataBuildService, useValue: {} },
        { provide: GLOBAL_CONFIG, useValue: {} },
        SearchService
      ],
    });
    searchService = TestBed.get(SearchService);
  });

  it('should return list view mode by default', () => {
    searchService.getViewMode().subscribe((viewMode) => {
      expect(viewMode).toBe(ViewMode.List);
    });
  });

  it('should return the view mode set through setViewMode', fakeAsync(() => {
    searchService.setViewMode(ViewMode.Grid)
    tick();
    let viewMode = ViewMode.List;
    searchService.getViewMode().subscribe((mode) => viewMode = mode);
    expect(viewMode).toBe(ViewMode.Grid);

    searchService.setViewMode(ViewMode.List)
    tick();
    searchService.getViewMode().subscribe((mode) => viewMode = mode);
    expect(viewMode).toBe(ViewMode.List);
  }));

});
