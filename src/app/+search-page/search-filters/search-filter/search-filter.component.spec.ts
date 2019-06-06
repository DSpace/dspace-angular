import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of as observableOf } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchFilterService } from './search-filter.service';
import { SearchService } from '../../search-service/search.service';
import { SearchFilterComponent } from './search-filter.component';
import { SearchFilterConfig } from '../../search-service/search-filter-config.model';
import { FilterType } from '../../search-service/filter-type.model';
import { SearchConfigurationService } from '../../search-service/search-configuration.service';
import { SearchConfigurationServiceStub } from '../../../shared/testing/search-configuration-service-stub';
import { SEARCH_CONFIG_SERVICE } from '../../../+my-dspace-page/my-dspace-page.component';

describe('SearchFilterComponent', () => {
  let comp: SearchFilterComponent;
  let fixture: ComponentFixture<SearchFilterComponent>;
  const filterName1 = 'test name';
  const filterName2 = 'test2';
  const filterName3 = 'another name3';
  const nonExistingFilter1 = 'non existing 1';
  const nonExistingFilter2 = 'non existing 2';
  const mockFilterConfig: SearchFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: filterName1,
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
    initializeFilter: (filter) => {
    },
    getSelectedValuesForFilter: (filter) => {
      return observableOf([filterName1, filterName2, filterName3])
    },
    isFilterActive: (filter) => {
      return observableOf([filterName1, filterName2, filterName3].indexOf(filter) >= 0);
    },
    isCollapsed: (filter) => {
      return observableOf(true)
    }
    /* tslint:enable:no-empty */

  };
  let filterService;
  const mockResults = observableOf(['test', 'data']);
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
        { provide: SEARCH_CONFIG_SERVICE, useValue: new SearchConfigurationServiceStub() }
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

  describe('when the initializeFilter method is triggered', () => {
    beforeEach(() => {
      spyOn(filterService, 'initializeFilter');
      comp.initializeFilter();
    });

    it('should call initialCollapse with the correct filter configuration name', () => {
      expect(filterService.initializeFilter).toHaveBeenCalledWith(mockFilterConfig)
    });
  });

  describe('when getSelectedValues is called', () => {
    let valuesObservable: Observable<string[]>;
    beforeEach(() => {
      valuesObservable = (comp as any).getSelectedValues();
    });

    it('should return an observable containing the existing filters', () => {
      const sub = valuesObservable.subscribe((values) => {
        expect(values).toContain(filterName1);
        expect(values).toContain(filterName2);
        expect(values).toContain(filterName3);
      });
      sub.unsubscribe();
    });

    it('should return an observable that does not contain the non-existing filters', () => {
      const sub = valuesObservable.subscribe((values) => {
        expect(values).not.toContain(nonExistingFilter1);
        expect(values).not.toContain(nonExistingFilter2);
      });
      sub.unsubscribe();
    });
  });

  describe('when isCollapsed is called and the filter is collapsed', () => {
    let isActive: Observable<boolean>;
    beforeEach(() => {
      filterService.isCollapsed = () => observableOf(true);
      isActive = (comp as any).isCollapsed();
    });

    it('should return an observable containing true', () => {
      const sub = isActive.subscribe((value) => {
        expect(value).toBeTruthy();
      });
      sub.unsubscribe();
    });
  });

  describe('when isCollapsed is called and the filter is not collapsed', () => {
    let isActive: Observable<boolean>;
    beforeEach(() => {
      filterService.isCollapsed = () => observableOf(false);
      isActive = (comp as any).isCollapsed();
    });

    it('should return an observable containing false', () => {
      const sub = isActive.subscribe((value) => {
        expect(value).toBeFalsy();
      });
      sub.unsubscribe();
    });
  });
});
