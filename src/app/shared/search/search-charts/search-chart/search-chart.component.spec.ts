import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import {
  BehaviorSubject,
  Observable,
  of,
} from 'rxjs';

import { SearchService } from '../../../../core/shared/search/search.service';
import { SearchFilterService } from '../../../../core/shared/search/search-filter.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-configuration.service';
import { SearchChartFilterWrapperComponent } from '../../../../shared/search/search-charts/search-chart/search-chart-wrapper/search-chart-wrapper.component';
import { SearchConfigurationServiceStub } from '../../../testing/search-configuration-service.stub';
import { FilterType } from '../../models/filter-type.model';
import { SearchFilterConfig } from '../../models/search-filter-config.model';
import { SearchChartComponent } from './search-chart.component';

describe('SearchChartComponent', () => {
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
    isOpenByDefault: false,
  });
  const mockFilterService = jasmine.createSpyObj('SearchFilterService', {
    expand: jasmine.createSpy('expand'),
    initializeFilter: jasmine.createSpy('initializeFilter'),
    getSelectedValuesForFilter: jasmine.createSpy('getSelectedValuesForFilter'),
    isFilterActive: jasmine.createSpy('isFilterActive'),
  });
  const mockResults = of(['test', 'data']);
  const searchServiceStub = jasmine.createSpyObj('SearchService', {
    getFacetValuesFor: jasmine.createSpy('getFacetValuesFor'),
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        NoopAnimationsModule,
        SearchChartComponent,
        MockComponent(SearchChartFilterWrapperComponent),
      ],
      providers: [
        provideRouter(([])),
        { provide: SearchService, useValue: searchServiceStub },
        { provide: SearchFilterService, useValue: mockFilterService },
        { provide: SEARCH_CONFIG_SERVICE, useValue: new SearchConfigurationServiceStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(SearchChartComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchChartComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    comp.filter = mockFilterConfig;
    comp.inPlaceSearch = false;
    comp.refreshFilters = new BehaviorSubject<boolean>(false);
    mockFilterService.getSelectedValuesForFilter.and.returnValue(of([filterName1, filterName2, filterName3]));
    searchServiceStub.getFacetValuesFor.and.returnValue(mockResults);
    fixture.detectChanges();
  });

  describe('when the initializeFilter method is triggered', () => {
    beforeEach(() => {
      comp.initializeFilter();
    });

    it('should call initialCollapse with the correct filter configuration name', () => {
      expect(mockFilterService.initializeFilter).toHaveBeenCalledWith(mockFilterConfig);
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
