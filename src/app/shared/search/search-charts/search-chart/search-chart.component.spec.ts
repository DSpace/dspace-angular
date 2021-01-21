import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of as observableOf } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchFilterService } from '../../../../core/shared/search/search-filter.service';
import { SearchService } from '../../../../core/shared/search/search.service';
import { SearchChartComponent } from './search-chart.component';
import { SearchFilterConfig } from '../../search-filter-config.model';
import { FilterType } from '../../filter-type.model';
import { SearchConfigurationServiceStub } from '../../../testing/search-configuration-service.stub';
import { SEARCH_CONFIG_SERVICE } from '../../../../+my-dspace-page/my-dspace-page.component';

xdescribe('SearchChartComponent', () => {
  let comp: SearchChartComponent;
  let fixture: ComponentFixture<SearchChartComponent>;
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
    expand: (filter) => {
    },
    initializeFilter: (filter) => {
    },
    getSelectedValuesForFilter: (filter) => {
      return observableOf([filterName1, filterName2, filterName3]);
    },
    isFilterActive: (filter) => {
      return observableOf([filterName1, filterName2, filterName3].indexOf(filter) >= 0);
    },
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
      declarations: [SearchChartComponent],
      providers: [
        { provide: SearchService, useValue: searchServiceStub },
        {
          provide: SearchFilterService,
          useValue: mockFilterService
        },
        { provide: SEARCH_CONFIG_SERVICE, useValue: new SearchConfigurationServiceStub() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(SearchChartComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchChartComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    comp.filter = mockFilterConfig;
    fixture.detectChanges();
    filterService = (comp as any).filterService;
  });

  describe('when the initializeFilter method is triggered', () => {
    beforeEach(() => {
      spyOn(filterService, 'initializeFilter');
      comp.initializeFilter();
    });

    it('should call initialCollapse with the correct filter configuration name', () => {
      expect(filterService.initializeFilter).toHaveBeenCalledWith(mockFilterConfig);
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

});
