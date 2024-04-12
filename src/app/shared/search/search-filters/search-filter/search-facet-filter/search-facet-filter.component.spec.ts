import { ChangeDetectionStrategy, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  CHANGE_APPLIED_FILTERS,
  FILTER_CONFIG,
  IN_PLACE_SEARCH,
  REFRESH_FILTER,
  SearchFilterService
} from '../../../../../core/shared/search/search-filter.service';
import { SearchFilterConfig } from '../../../models/search-filter-config.model';
import { FilterType } from '../../../models/filter-type.model';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, of as observableOf } from 'rxjs';
import { SearchService } from '../../../../../core/shared/search/search.service';
import { SearchServiceStub } from '../../../../testing/search-service.stub';
import { RouterStub } from '../../../../testing/router.stub';
import { Router } from '@angular/router';
import { SearchFacetFilterComponent } from './search-facet-filter.component';
import { RemoteDataBuildService } from '../../../../../core/cache/builders/remote-data-build.service';
import { SearchConfigurationServiceStub } from '../../../../testing/search-configuration-service.stub';
import { SEARCH_CONFIG_SERVICE } from '../../../../../my-dspace-page/my-dspace-page.component';
import { createSuccessfulRemoteDataObject$ } from '../../../../remote-data.utils';
import { AppliedFilter } from '../../../models/applied-filter.model';
import { FacetValues } from '../../../models/facet-values.model';
import { SearchFilterServiceStub } from '../../../../testing/search-filter-service.stub';

describe('SearchFacetFilterComponent', () => {
  let comp: SearchFacetFilterComponent;
  let fixture: ComponentFixture<SearchFacetFilterComponent>;
  const filterName1 = 'test name';
  const value1 = 'testvalue1';
  const value2 = 'test2';
  const value3 = 'another value3';
  const mockFilterConfig: SearchFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: filterName1,
    filterType: FilterType.text,
    hasFacets: false,
    isOpenByDefault: false,
    pageSize: 2
  });
  const values: Partial<FacetValues> = {
    appliedFilters: [
      {
        filter: filterName1,
        operator: 'equals',
        label: value1,
        value: value1,
      },
      {
        filter: filterName1,
        operator: 'equals',
        label: value2,
        value: value2,
      },
      {
        filter: filterName1,
        operator: 'equals',
        label: value3,
        value: value3,
      }
    ]
  };

  const searchLink = '/search';
  const selectedValues = [value1, value2];
  let filterService: SearchFilterServiceStub;
  let searchService: SearchServiceStub;
  let router: RouterStub;
  let searchConfigService: SearchConfigurationServiceStub;

  beforeEach(waitForAsync(() => {
    searchService = new SearchServiceStub(searchLink);
    filterService = new SearchFilterServiceStub();
    router = new RouterStub();
    searchConfigService = new SearchConfigurationServiceStub();

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, FormsModule],
      declarations: [SearchFacetFilterComponent],
      providers: [
        { provide: SearchService, useValue: searchService },
        { provide: SearchFilterService, useValue: filterService },
        { provide: Router, useValue: router },
        { provide: FILTER_CONFIG, useValue: new SearchFilterConfig() },
        { provide: RemoteDataBuildService, useValue: { aggregate: () => observableOf({}) } },
        { provide: SEARCH_CONFIG_SERVICE, useValue: searchConfigService },
        { provide: IN_PLACE_SEARCH, useValue: false },
        { provide: REFRESH_FILTER, useValue: new BehaviorSubject<boolean>(false) },
        { provide: CHANGE_APPLIED_FILTERS, useValue: new EventEmitter() },
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
    spyOn(searchService, 'getFacetValuesFor').and.returnValue(createSuccessfulRemoteDataObject$(values));
    fixture.detectChanges();
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

  describe('when the showMore method is called', () => {
    beforeEach(() => {
      spyOn(filterService, 'incrementPage');
      comp.showMore();
    });

    it('should call incrementPage on the filterService with the correct filter parameter name', () => {
      expect(filterService.incrementPage).toHaveBeenCalledWith(mockFilterConfig.name);
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
      expect(filterService.getPage).toHaveBeenCalledWith(mockFilterConfig.name);
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

    beforeEach(() => {
      comp.selectedAppliedFilters$ = observableOf(selectedValues.map((value) =>
        Object.assign(new AppliedFilter(), {
          filter: filterName1,
          operator: 'equals',
          label: value,
          value: value
        })));
      fixture.detectChanges();
      spyOn(comp, 'getSearchLink').and.returnValue(searchUrl);
      spyOn(searchConfigService, 'selectNewAppliedFilterParams').and.returnValue(observableOf({ [mockFilterConfig.paramName]: [...selectedValues.map((value) => `${value},equals`), `${testValue},equals`] }));
    });

    it('should call navigate on the router with the right searchlink and parameters when the filter is provided with a valid operator', () => {
      comp.onSubmit(testValue + ',equals');
      expect(searchConfigService.selectNewAppliedFilterParams).toHaveBeenCalledWith(filterName1, testValue, 'equals');
      expect(router.navigate).toHaveBeenCalledWith(searchUrl.split('/'), {
        queryParams: { [mockFilterConfig.paramName]: [...selectedValues.map((value) => `${value},equals`), `${testValue},equals`] },
      });
    });

    it('should not call navigate on the router when the filter is not provided with a valid operator', () => {
      comp.onSubmit(testValue);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should not call navigate on the router when the empty string is given as filter', () => {
      comp.onSubmit(',equals');
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('when updateFilterValueList is called', () => {
    beforeEach(() => {
      spyOn(comp, 'showFirstPageOnly');
      comp.updateFilterValueList();
    });

    it('should call showFirstPageOnly and empty the filter', () => {
      expect(comp.animationState).toEqual('loading');
      expect((comp as any).collapseNextUpdate).toBeTruthy();
      expect(comp.filter).toEqual('');
    });
  });
});
