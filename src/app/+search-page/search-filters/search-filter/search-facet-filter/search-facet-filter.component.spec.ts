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
import { SearchFacetFilterComponent } from './search-facet-filter.component';
import { RemoteDataBuildService } from '../../../../core/cache/builders/remote-data-build.service';
import { SearchConfigurationService } from '../../../search-service/search-configuration.service';

describe('SearchFacetFilterComponent', () => {
  let comp: SearchFacetFilterComponent;
  let fixture: ComponentFixture<SearchFacetFilterComponent>;
  const filterName1 = 'test name';
  const value1 = 'testvalue1';
  const value2 = 'test2';
  const value3 = 'another value3';
  const mockFilterConfig: SearchFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: filterName1,
    type: FilterType.text,
    hasFacets: false,
    isOpenByDefault: false,
    pageSize: 2
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
  const selectedValues = [value1, value2];
  let filterService;
  let searchService;
  let router;
  const page = Observable.of(0);

  const mockValues = Observable.of(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), values)));
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, FormsModule],
      declarations: [SearchFacetFilterComponent],
      providers: [
        { provide: SearchService, useValue: new SearchServiceStub(searchLink) },
        { provide: Router, useValue: new RouterStub() },
        { provide: FILTER_CONFIG, useValue: new SearchFilterConfig() },
        { provide: RemoteDataBuildService, useValue: {aggregate: () => Observable.of({})} },
        { provide: SearchConfigurationService, useValue: {searchOptions: Observable.of({})} },
        {
          provide: SearchFilterService, useValue: {
            getSelectedValuesForFilter: () => Observable.of(selectedValues),
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
    }).overrideComponent(SearchFacetFilterComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFacetFilterComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    comp.filterConfig = mockFilterConfig;
    filterService = (comp as any).filterService;
    searchService = (comp as any).searchService;
    spyOn(searchService, 'getFacetValuesFor').and.returnValue(mockValues);
    router = (comp as any).router;
    fixture.detectChanges();
  });

  describe('when the isChecked method is called with a value', () => {
    beforeEach(() => {
      spyOn(filterService, 'isFilterActiveWithValue');
      comp.isChecked(values[1]);
    });

    it('should call isFilterActiveWithValue on the filterService with the correct filter parameter name and the passed value', () => {
      expect(filterService.isFilterActiveWithValue).toHaveBeenCalledWith(mockFilterConfig.paramName, values[1].value)
    });
  });

  describe('when the getSearchLink method is triggered', () => {
    let link: string;
    beforeEach(() => {
      link = comp.getSearchLink();
    });

    it('should return the value of the searchLink variable in the filter service', () => {
      expect(link).toEqual(searchLink);
    });
  });

  describe('when the getAddParams method is called wih a value', () => {
    it('should return the selectedValue list with the new parameter value', () => {
      const result = comp.getAddParams(value3);
      result.subscribe((r) => expect(r[mockFilterConfig.paramName]).toEqual([value1, value2, value3]));
    });
  });

  describe('when the getRemoveParams method is called wih a value', () => {
    it('should return the selectedValue list with the parameter value left out', () => {
      const result = comp.getRemoveParams(value1);
      result.subscribe((r) => expect(r[mockFilterConfig.paramName]).toEqual([value2]));
    });
  });

  describe('when the showMore method is called', () => {
    beforeEach(() => {
      spyOn(filterService, 'incrementPage');
      comp.showMore();
    });

    it('should call incrementPage on the filterService with the correct filter parameter name', () => {
      expect(filterService.incrementPage).toHaveBeenCalledWith(mockFilterConfig.name)
    });
  });

  describe('when the showFirstPageOnly method is called', () => {
    beforeEach(() => {
      spyOn(filterService, 'resetPage');
      comp.showFirstPageOnly();
    });

    it('should call resetPage on the filterService with the correct filter parameter name', () => {
      expect(filterService.resetPage).toHaveBeenCalledWith(mockFilterConfig.name);
    });
  });

  describe('when the getCurrentPage method is called', () => {
    beforeEach(() => {
      spyOn(filterService, 'getPage');
      comp.getCurrentPage();
    });

    it('should call getPage on the filterService with the correct filter parameter name', () => {
      expect(filterService.getPage).toHaveBeenCalledWith(mockFilterConfig.name)
    });
  });

  describe('when the getCurrentUrl method is called', () => {
    const url = 'test.url/test';
    beforeEach(() => {
      router.navigateByUrl(url);
    });

    it('should call getPage on the filterService with the correct filter parameter name', () => {
      expect(router.url).toEqual(url);
    });
  });

  describe('when the onSubmit method is called with data', () => {
    const searchUrl = '/search/path';
    const testValue = 'test';
    const data = testValue;
    beforeEach(() => {
      spyOn(comp, 'getSearchLink').and.returnValue(searchUrl);
      comp.onSubmit(data);
    });

    it('should call navigate on the router with the right searchlink and parameters', () => {
      expect(router.navigate).toHaveBeenCalledWith([searchUrl], {
        queryParams: { [mockFilterConfig.paramName]: [...selectedValues, testValue] },
        queryParamsHandling: 'merge'
      });
    });
  });

  describe('when updateFilterValueList is called', () => {
    beforeEach(() => {
      spyOn(comp, 'showFirstPageOnly');
      comp.updateFilterValueList()
    });

    it('should call showFirstPageOnly and empty the filter', () => {
        expect(comp.animationState).toEqual('loading');
        expect((comp as any).collapseNextUpdate).toBeTruthy();
        expect(comp.filter).toEqual('');
    });
  });

  describe('when findSuggestions is called with query \'test\'', () => {
    const query = 'test';
    beforeEach(() => {
      comp.findSuggestions(query);
    });

    it('should call getFacetValuesFor on the component\'s SearchService with the right query', () => {
      expect((comp as any).searchService.getFacetValuesFor).toHaveBeenCalledWith(comp.filterConfig, 1, {}, query);
    });
  });
});
