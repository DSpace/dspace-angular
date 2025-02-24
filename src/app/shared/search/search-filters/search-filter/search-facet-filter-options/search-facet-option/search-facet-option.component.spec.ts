import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  ActivatedRouteStub,
  FacetValue,
  FilterType,
  PaginationComponentOptions,
  PaginationService,
  PaginationServiceStub,
  RouterStub,
  SearchConfigurationService,
  SearchConfigurationServiceStub,
  SearchFilterConfig,
  SearchFilterService,
  SearchFilterServiceStub,
  SearchService,
  SearchServiceStub,
} from '@dspace/core';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { ShortNumberPipe } from '../../../../../utils/short-number.pipe';
import { SearchFacetOptionComponent } from './search-facet-option.component';

describe('SearchFacetOptionComponent', () => {
  let comp: SearchFacetOptionComponent;
  let fixture: ComponentFixture<SearchFacetOptionComponent>;
  const filterName1 = 'testname';
  const value2 = 'test2';

  const mockFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: filterName1,
    filterType: FilterType.range,
    hasFacets: false,
    isOpenByDefault: false,
    pageSize: 2,
    minValue: 200,
    maxValue: 3000,
  });

  const facetValue: FacetValue = {
    label: value2,
    value: value2,
    count: 20,
    _links: {
      self: { href: 'selectedValue-self-link2' },
      search: { href: `` },
    },
  };

  const searchLink = '/search';
  let searchConfigurationService: SearchConfigurationServiceStub;
  let searchFilterService: SearchFilterServiceStub;
  let searchService: SearchServiceStub;
  let router: RouterStub;

  const pagination = Object.assign(new PaginationComponentOptions(), { id: 'test-id', currentPage: 1, pageSize: 20 });
  const paginationService = new PaginationServiceStub(pagination);

  beforeEach(waitForAsync(() => {
    searchConfigurationService = new SearchConfigurationServiceStub();
    searchFilterService = new SearchFilterServiceStub();
    searchService = new SearchServiceStub(searchLink);
    router = new RouterStub();

    void TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, FormsModule, SearchFacetOptionComponent, ShortNumberPipe],
      providers: [
        { provide: SearchService, useValue: searchService },
        { provide: Router, useValue: router },
        { provide: PaginationService, useValue: paginationService },
        { provide: SearchConfigurationService, useValue: searchConfigurationService },
        { provide: SearchFilterService, useValue: searchFilterService },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(SearchFacetOptionComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFacetOptionComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    comp.filterValue = facetValue;
    comp.filterConfig = mockFilterConfig;
    fixture.detectChanges();
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
