import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FILTER_CONFIG, SearchFilterService } from '../search-filter.service';
import { SearchFilterConfig } from '../../../search-service/search-filter-config.model';
import { FilterType } from '../../../search-service/filter-type.model';
import { FacetValue } from '../../../search-service/facet-value.model';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { SearchService } from '../../../search-service/search.service';
import { SearchServiceStub } from '../../../../shared/testing/search-service-stub';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { RouterStub } from '../../../../shared/testing/router-stub';
import { Router } from '@angular/router';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { SearchRangeFilterComponent } from './search-range-filter.component';
import { RouteService } from '../../../../shared/services/route.service';
import { RemoteDataBuildService } from '../../../../core/cache/builders/remote-data-build.service';
import { SearchConfigurationService } from '../../../search-service/search-configuration.service';

describe('SearchRangeFilterComponent', () => {
  let comp: SearchRangeFilterComponent;
  let fixture: ComponentFixture<SearchRangeFilterComponent>;
  const minSuffix = '.min';
  const maxSuffix = '.max';
  const dateFormats = ['YYYY', 'YYYY-MM', 'YYYY-MM-DD'];
  const filterName1 = 'test name';
  const value1 = '2000 - 2012';
  const value2 = '1992 - 2000';
  const value3 = '1990 - 1992';
  const mockFilterConfig: SearchFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: filterName1,
    type: FilterType.range,
    hasFacets: false,
    isOpenByDefault: false,
    pageSize: 2,
    minValue: 200,
    maxValue: 3000,
  });
  const values: FacetValue[] = [
    {
      value: value1,
      count: 52,
      search: ''
    }, {
      value: value2,
      count: 20,
      search: ''
    }, {
      value: value3,
      count: 5,
      search: ''
    }
  ];

  const searchLink = '/search';
  const selectedValues = Observable.of([value1]);
  let filterService;
  let searchService;
  let router;
  const page = Observable.of(0);

  const mockValues = Observable.of(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), values)));
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, FormsModule],
      declarations: [SearchRangeFilterComponent],
      providers: [
        { provide: SearchService, useValue: new SearchServiceStub(searchLink) },
        { provide: Router, useValue: new RouterStub() },
        { provide: FILTER_CONFIG, useValue: mockFilterConfig },
        { provide: RemoteDataBuildService, useValue: {aggregate: () => Observable.of({})} },
        { provide: RouteService, useValue: {getQueryParameterValue: () => Observable.of({})} },
        { provide: SearchConfigurationService, useValue: {
            searchOptions: Observable.of({}) }
        },
        {
          provide: SearchFilterService, useValue: {
            getSelectedValuesForFilter: () => selectedValues,
            isFilterActiveWithValue: (paramName: string, filterValue: string) => true,
            getPage: (paramName: string) => page,
            /* tslint:disable:no-empty */
            incrementPage: (filterName: string) => {
            },
            resetPage: (filterName: string) => {
            }
            /* tslint:enable:no-empty */
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(SearchRangeFilterComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRangeFilterComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    filterService = (comp as any).filterService;
    searchService = (comp as any).searchService;
    spyOn(searchService, 'getFacetValuesFor').and.returnValue(mockValues);
    router = (comp as any).router;
    fixture.detectChanges();
  });

  describe('when the getChangeParams method is called wih a value', () => {
    it('should return the selectedValue list with the new parameter value', () => {
      const result$ = comp.getChangeParams(value3);
      result$.subscribe((result) => {
        expect(result[mockFilterConfig.paramName + minSuffix]).toEqual(['1990']);
        expect(result[mockFilterConfig.paramName + maxSuffix]).toEqual(['1992']);
      });
    });
  });

  describe('when the onSubmit method is called with data', () => {
    const searchUrl = '/search/path';
    // const data = { [mockFilterConfig.paramName + minSuffix]: '1900', [mockFilterConfig.paramName + maxSuffix]: '1950' };
    beforeEach(() => {
      comp.range = [1900, 1950];
      spyOn(comp, 'getSearchLink').and.returnValue(searchUrl);
      comp.onSubmit();
    });

    it('should call navigate on the router with the right searchlink and parameters', () => {
      expect(router.navigate).toHaveBeenCalledWith([searchUrl], {
        queryParams: {
          [mockFilterConfig.paramName + minSuffix]: [1900],
          [mockFilterConfig.paramName + maxSuffix]: [1950]
        },
        queryParamsHandling: 'merge'
      });
    });
  });
});
