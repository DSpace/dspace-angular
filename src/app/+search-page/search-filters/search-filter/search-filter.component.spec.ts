import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchFilterService } from './search-filter.service';
import { SearchService } from '../../search-service/search.service';
import { SearchFilterComponent } from './search-filter.component';
import { SearchFilterConfig } from '../../search-service/search-filter-config.model';
import { FilterType } from '../../search-service/filter-type.model';

describe('SearchFilterComponent', () => {
  let comp: SearchFilterComponent;
  let fixture: ComponentFixture<SearchFilterComponent>;
  const filterName = 'test name'
  const mockFilterConfig: SearchFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: filterName,
    type: FilterType.text,
    hasFacets: false,
    isOpenByDefault: false
  });
  const mockFilterService = {
    /* tslint:disable:no-empty */
    toggle: (filter) => {
    },
    collapse: (filter) => {
    },
    expand: (filter) => {
    },
    initialCollapse: (filter) => {
    },
    initialExpand: (filter) => {
    },
    getSelectedValuesForFilter: (filter) => {
    },
    isFilterActive: (filter) => {
      return Observable.of(true)
    },
    isCollapsed: (filter) => {
      return Observable.of(true)
    }
    /* tslint:enable:no-empty */

  };
  let filterService;
  const mockResults = Observable.of(['test', 'data']);
  const searchServiceStub = {
    getFacetValuesFor: (filter) => mockResults
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NoopAnimationsModule],
      declarations: [SearchFilterComponent],
      providers: [
        { provide: SearchService, useValue: searchServiceStub },
        {
          provide: SearchFilterService,
          useValue: mockFilterService
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(SearchFilterComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFilterComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    comp.filter = mockFilterConfig;
    fixture.detectChanges();
    filterService = (comp as any).filterService;
  });

  describe('when the toggle method is triggered', () => {
    beforeEach(() => {
      spyOn(filterService, 'toggle');
      comp.toggle();
    });

    it('should call toggle with the correct filter configuration name', () => {
      expect(filterService.toggle).toHaveBeenCalledWith(mockFilterConfig.name)
    });
  });

  describe('when the initialCollapse method is triggered', () => {
    beforeEach(() => {
      spyOn(filterService, 'initialCollapse');
      comp.initialCollapse();
    });

    it('should call initialCollapse with the correct filter configuration name', () => {
      expect(filterService.initialCollapse).toHaveBeenCalledWith(mockFilterConfig.name)
    });
  });

  describe('when the initialExpand method is triggered', () => {
    beforeEach(() => {
      spyOn(filterService, 'initialExpand');
      comp.initialExpand();
    });

    it('should call initialCollapse with the correct filter configuration name', () => {
      expect(filterService.initialExpand).toHaveBeenCalledWith(mockFilterConfig.name)
    });
  });


});
