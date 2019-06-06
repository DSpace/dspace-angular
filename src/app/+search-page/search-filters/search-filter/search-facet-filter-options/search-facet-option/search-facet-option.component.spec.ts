import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchFacetOptionComponent } from './search-facet-option.component';
import { SearchFilterConfig } from '../../../../search-service/search-filter-config.model';
import { FilterType } from '../../../../search-service/filter-type.model';
import { FacetValue } from '../../../../search-service/facet-value.model';
import { FormsModule } from '@angular/forms';
import { of as observableOf } from 'rxjs';
import { SearchService } from '../../../../search-service/search.service';
import { SearchServiceStub } from '../../../../../shared/testing/search-service-stub';
import { Router } from '@angular/router';
import { RouterStub } from '../../../../../shared/testing/router-stub';
import { SearchConfigurationService } from '../../../../search-service/search-configuration.service';
import { SearchFilterService } from '../../search-filter.service';
import { By } from '@angular/platform-browser';

describe('SearchFacetOptionComponent', () => {
  let comp: SearchFacetOptionComponent;
  let fixture: ComponentFixture<SearchFacetOptionComponent>;
  const filterName1 = 'testname';
  const filterName2 = 'testAuthorityname';
  const value1 = 'testvalue1';
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

  const value: FacetValue = {
    label: value2,
    value: value2,
    count: 20,
    search: ``
  };

  const selectedValue: FacetValue = {
    label: value1,
    value: value1,
    count: 20,
    search: `http://test.org/api/discover/search/objects?f.${filterName1}=${value1},${operator}`
  };

  const authorityValue: FacetValue = {
    label: value2,
    value: value2,
    count: 20,
    search: `http://test.org/api/discover/search/objects?f.${filterName2}=${value2},${operator}`
  };

  const searchLink = '/search';
  const selectedValues = [selectedValue];
  const selectedValues$ = observableOf(selectedValues);
  let filterService;
  let searchService;
  let router;
  const page = observableOf(0);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, FormsModule],
      declarations: [SearchFacetOptionComponent],
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
    }).overrideComponent(SearchFacetOptionComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFacetOptionComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    filterService = (comp as any).filterService;
    searchService = (comp as any).searchService;
    router = (comp as any).router;
    comp.filterValue = value;
    comp.selectedValues$ = selectedValues$;
    comp.filterConfig = mockFilterConfig;
    fixture.detectChanges();
  });

  describe('when the updateAddParams method is called with a value', () => {
    it('should update the addQueryParams with the new parameter values', () => {
      comp.addQueryParams = {};
      (comp as any).updateAddParams(selectedValues);
      expect(comp.addQueryParams).toEqual({
        [mockFilterConfig.paramName]: [value1, value.value],
        page: 1
      });
    });
  });

  describe('when filter type is authority and the updateAddParams method is called with a value', () => {
    it('should update the addQueryParams with the new parameter values', () => {
      comp.filterValue = authorityValue;
      comp.filterConfig = mockAuthorityFilterConfig;
      fixture.detectChanges();

      comp.addQueryParams = {};
      (comp as any).updateAddParams(selectedValues);
      expect(comp.addQueryParams).toEqual({
        [mockAuthorityFilterConfig.paramName]: [value1, `${value2},${operator}`],
        page: 1
      });
    });
  });

  describe('when isVisible emits true', () => {
    it('the facet option should be visible', () => {
      comp.isVisible = observableOf(true);
      fixture.detectChanges();
      const linkEl = fixture.debugElement.query(By.css('a'));
      expect(linkEl).not.toBeNull();
    });
  });

  describe('when isVisible emits false', () => {
    it('the facet option should not be visible', () => {
      comp.isVisible = observableOf(false);
      fixture.detectChanges();
      const linkEl = fixture.debugElement.query(By.css('a'));
      expect(linkEl).toBeNull();
    });
  });
});
