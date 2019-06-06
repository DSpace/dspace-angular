import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchFilterConfig } from '../../../../search-service/search-filter-config.model';
import { FilterType } from '../../../../search-service/filter-type.model';
import { FormsModule } from '@angular/forms';
import { of as observableOf } from 'rxjs';
import { SearchService } from '../../../../search-service/search.service';
import { SearchServiceStub } from '../../../../../shared/testing/search-service-stub';
import { Router } from '@angular/router';
import { RouterStub } from '../../../../../shared/testing/router-stub';
import { SearchConfigurationService } from '../../../../search-service/search-configuration.service';
import { SearchFilterService } from '../../search-filter.service';
import { SearchFacetSelectedOptionComponent } from './search-facet-selected-option.component';
import { FacetValue } from '../../../../search-service/facet-value.model';

describe('SearchFacetSelectedOptionComponent', () => {
  let comp: SearchFacetSelectedOptionComponent;
  let fixture: ComponentFixture<SearchFacetSelectedOptionComponent>;
  const filterName1 = 'test name';
  const filterName2 = 'testAuthorityname';
  const label1 = 'test value 1';
  const value1 = 'testvalue1';
  const label2 = 'test 2';
  const value2 = 'test2';
  const operator = 'authority';
  const mockFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: filterName1,
    type: FilterType.range,
    hasFacets: false,
    isOpenByDefault: false,
    pageSize: 2,
    minValue: 200,
    maxValue: 3000,
  });
  const mockAuthorityFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: filterName2,
    type: FilterType.authority,
    hasFacets: false,
    isOpenByDefault: false,
    pageSize: 2
  });

  const searchLink = '/search';
  const selectedValue: FacetValue = {
    label: value1,
    value: value1,
    count: 20,
    search: `http://test.org/api/discover/search/objects?f.${filterName1}=${value1}`
  };
  const selectedValue2: FacetValue = {
    label: value2,
    value: value2,
    count: 20,
    search: `http://test.org/api/discover/search/objects?f.${filterName1}=${value2}`
  };
  const selectedAuthorityValue: FacetValue = {
    label: label1,
    value: value1,
    count: 20,
    search: `http://test.org/api/discover/search/objects?f.${filterName2}=${value1},${operator}`
  };
  const selectedAuthorityValue2: FacetValue = {
    label: label2,
    value: value2,
    count: 20,
    search: `http://test.org/api/discover/search/objects?f.${filterName2}=${value2},${operator}`
  };
  const selectedValues = [selectedValue, selectedValue2];
  const selectedAuthorityValues = [selectedAuthorityValue, selectedAuthorityValue2];
  const facetValue = {
    label: value2,
    value: value2,
    count: 1,
    search: ''
  };
  const authorityValue: FacetValue = {
    label: label2,
    value: value2,
    count: 20,
    search: `http://test.org/api/discover/search/objects?f.${filterName2}=${value2},${operator}`
  };
  const selectedValues$ = observableOf(selectedValues);
  const selectedAuthorityValues$ = observableOf(selectedAuthorityValues);
  let filterService;
  let searchService;
  let router;
  const page = observableOf(0);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, FormsModule],
      declarations: [SearchFacetSelectedOptionComponent],
      providers: [
        { provide: SearchService, useValue: new SearchServiceStub(searchLink) },
        { provide: Router, useValue: new RouterStub() },
        {
          provide: SearchConfigurationService, useValue: {
            searchOptions: observableOf({})
          }
        },
        {
          provide: SearchFilterService, useValue: {
            getSelectedValuesForFilter: () => selectedValues,
            isFilterActiveWithValue: (paramName: string, filterValue: string) => observableOf(true),
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
    }).overrideComponent(SearchFacetSelectedOptionComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFacetSelectedOptionComponent);
    comp = fixture.componentInstance; // SearchFacetSelectedOptionComponent test instance
    filterService = (comp as any).filterService;
    searchService = (comp as any).searchService;
    router = (comp as any).router;
    comp.selectedValue = facetValue;
    comp.selectedValues$ = selectedValues$;
    comp.filterConfig = mockFilterConfig;
    fixture.detectChanges();
  });

  describe('when the updateRemoveParams method is called wih a value', () => {
    it('should update the removeQueryParams with the new parameter values', () => {
      comp.removeQueryParams = {};
      (comp as any).updateRemoveParams(selectedValues);
      expect(comp.removeQueryParams).toEqual({
        [mockFilterConfig.paramName]: [value1],
        page: 1
      });
    });
  });

  describe('when filter type is authority and the updateRemoveParams method is called with a value', () => {
    it('should update the removeQueryParams with the new parameter values', () => {
      spyOn(filterService, 'getSelectedValuesForFilter').and.returnValue(selectedAuthorityValues);
      comp.selectedValue = authorityValue;
      comp.selectedValues$ = selectedAuthorityValues$;
      comp.filterConfig = mockAuthorityFilterConfig;
      comp.removeQueryParams = {};
      fixture.detectChanges();
      (comp as any).updateRemoveParams(selectedAuthorityValues);
      expect(comp.removeQueryParams).toEqual({
        [mockAuthorityFilterConfig.paramName]: [`${value1},${operator}`],
        page: 1
      });
    });
  });
});
