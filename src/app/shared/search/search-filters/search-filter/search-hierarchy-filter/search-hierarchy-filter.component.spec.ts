import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchHierarchyFilterComponent } from './search-hierarchy-filter.component';
import { SearchService } from '../../../../../core/shared/search/search.service';
import {
  CHANGE_APPLIED_FILTERS,
  FILTER_CONFIG,
  IN_PLACE_SEARCH,
  REFRESH_FILTER,
  SearchFilterService
} from '../../../../../core/shared/search/search-filter.service';
import { RemoteDataBuildService } from '../../../../../core/cache/builders/remote-data-build.service';
import { SearchFiltersComponent } from '../../search-filters.component';
import { Router } from '@angular/router';
import { RouterStub } from '../../../../testing/router.stub';
import { SearchServiceStub } from '../../../../testing/search-service.stub';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { SEARCH_CONFIG_SERVICE } from '../../../../../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationServiceStub } from '../../../../testing/search-configuration-service.stub';
import { AppliedFilter } from '../../../models/applied-filter.model';
import { SearchFilterConfig } from '../../../models/search-filter-config.model';
import { TranslateModule } from '@ngx-translate/core';
import {
  FilterInputSuggestionsComponent
} from '../../../../input-suggestions/filter-suggestions/filter-input-suggestions.component';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ChangeDetectionStrategy, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { createSuccessfulRemoteDataObject$ } from '../../../../remote-data.utils';
import { FacetValue } from '../../../models/facet-value.model';
import { FilterType } from '../../../models/filter-type.model';
import { RemoteData } from '../../../../../core/data/remote-data';
import { FacetValues } from '../../../models/facet-values.model';
import { SearchOptions } from '../../../models/search-options.model';

describe('SearchHierarchyFilterComponent', () => {
  let comp: SearchHierarchyFilterComponent;
  let fixture: ComponentFixture<SearchHierarchyFilterComponent>;
  let searchService: SearchServiceStub;
  let router;

  const value1 = 'testvalue1';
  const value2 = 'test2';
  const value3 = 'another value3';
  const values: FacetValues = {
    appliedFilters: [
      {
        filter: 'filterName1',
        operator: 'equals',
        label: value1,
        value: value1,
      },
      {
        filter: 'filterName1',
        operator: 'equals',
        label: value2,
        value: value2,
      },
      {
        filter: 'filterName1',
        operator: 'equals',
        label: value3,
        value: value3,
      },
    ],
    pageInfo: {
      currentPage: 1,
    },
  } as Partial<FacetValues> as FacetValues;

  const searchFilterServiceStub = {
    getSelectedValuesForFilter(_filterConfig: SearchFilterConfig): Observable<string[]> {
      return observableOf(values.appliedFilters.map((value: AppliedFilter) => value.value));
    },
    getPage(_paramName: string): Observable<number> {
      return observableOf(0);
    },
    resetPage(_filterName: string): void {
      // empty
    }
  };

  const remoteDataBuildServiceStub = {
    aggregate(_input: Observable<RemoteData<FacetValue>>[]): Observable<RemoteData<FacetValues[]>> {
      return createSuccessfulRemoteDataObject$([values]);
    }
  };

  beforeEach(async () => {
    searchService = new SearchServiceStub();

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, FormsModule],
      declarations: [
        SearchHierarchyFilterComponent,
        SearchFiltersComponent,
        FilterInputSuggestionsComponent
      ],
      providers: [
        { provide: SearchService, useValue: searchService },
        { provide: SearchFilterService, useValue: searchFilterServiceStub },
        { provide: RemoteDataBuildService, useValue: remoteDataBuildServiceStub },
        { provide: Router, useValue: new RouterStub() },
        { provide: SEARCH_CONFIG_SERVICE, useValue: new SearchConfigurationServiceStub() },
        { provide: IN_PLACE_SEARCH, useValue: false },
        { provide: FILTER_CONFIG, useValue: new SearchFilterConfig() },
        { provide: REFRESH_FILTER, useValue: new BehaviorSubject<boolean>(false) },
        { provide: CHANGE_APPLIED_FILTERS, useValue: new EventEmitter() },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(SearchHierarchyFilterComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  })
  ;
  const mockFilterConfig: SearchFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: 'filterName1',
    filterType: FilterType.text,
    hasFacets: false,
    isOpenByDefault: false,
    pageSize: 2
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(SearchHierarchyFilterComponent);
    comp = fixture.componentInstance; // SearchHierarchyFilterComponent test instance
    comp.filterConfig = mockFilterConfig;
    spyOn(searchService, 'getFacetValuesFor').and.returnValue(createSuccessfulRemoteDataObject$(values as FacetValues));
    router = (comp as any).router;
    fixture.detectChanges();
  });

  it('should navigate to the correct filter with the query operator', () => {
    expect(searchService.getFacetValuesFor).toHaveBeenCalledWith(comp.filterConfig, 0, {} as SearchOptions, null, true);

    const searchQuery = 'MARVEL';
    comp.onSubmit(searchQuery);

    expect(router.navigate).toHaveBeenCalledWith(['', 'search'], Object({
      queryParams: Object({ [mockFilterConfig.paramName]: [...values.appliedFilters.map((value: AppliedFilter) => `${value.value},equals`), `${searchQuery},query`] }),
      queryParamsHandling: 'merge'
    }));
  });
});
