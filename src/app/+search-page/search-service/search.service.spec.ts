import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { SearchService } from './search.service';
import { ItemDataService } from './../../core/data/item-data.service';
import { ViewMode } from '../../+search-page/search-options.model';

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
