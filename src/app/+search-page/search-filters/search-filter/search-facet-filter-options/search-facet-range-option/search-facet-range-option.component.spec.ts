import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
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
import { SearchFacetRangeOptionComponent } from './search-facet-range-option.component';
import {
  RANGE_FILTER_MAX_SUFFIX,
  RANGE_FILTER_MIN_SUFFIX
} from '../../search-range-filter/search-range-filter.component';

describe('SearchFacetRangeOptionComponent', () => {
  let comp: SearchFacetRangeOptionComponent;
  let fixture: ComponentFixture<SearchFacetRangeOptionComponent>;
  const filterName1 = 'test name';
  const value2 = '20 - 30';
  const mockFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: filterName1,
    type: FilterType.range,
    hasFacets: false,
    isOpenByDefault: false,
    pageSize: 2,
    minValue: 200,
    maxValue: 3000,
  });
  const value: FacetValue = {
    label: value2,
    value: value2,
    count: 20,
    search: ''
  };

  const searchLink = '/search';
  let filterService;
  let searchService;
  let router;
  const page = observableOf(0);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, FormsModule],
      declarations: [SearchFacetRangeOptionComponent],
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
    }).overrideComponent(SearchFacetRangeOptionComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFacetRangeOptionComponent);
    comp = fixture.componentInstance; // SearchFacetRangeOptionComponent test instance
    filterService = (comp as any).filterService;
    searchService = (comp as any).searchService;
    router = (comp as any).router;
    comp.filterValue = value;
    comp.filterConfig = mockFilterConfig;
    fixture.detectChanges();
  });

  describe('when the updateChangeParams method is called wih a value', () => {
    it('should update the changeQueryParams with the new parameter values', () => {
      comp.changeQueryParams = {};
      comp.filterValue = {
        label: '50-60',
        value: '50-60',
        count: 20,
        search: ''
      };
      (comp as any).updateChangeParams();
      expect(comp.changeQueryParams).toEqual({
        [mockFilterConfig.paramName + RANGE_FILTER_MIN_SUFFIX]: ['50'],
        [mockFilterConfig.paramName + RANGE_FILTER_MAX_SUFFIX]: ['60'],
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
