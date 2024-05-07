import { ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of as observableOf } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchFilterService } from '../../../../core/shared/search/search-filter.service';
import { SearchService } from '../../../../core/shared/search/search.service';
import { SearchFilterComponent } from './search-filter.component';
import { SearchFilterConfig } from '../../models/search-filter-config.model';
import { FilterType } from '../../models/filter-type.model';
import { SearchConfigurationServiceStub } from '../../../testing/search-configuration-service.stub';
import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-page.component';
import { SequenceService } from '../../../../core/shared/sequence.service';
import { BrowserOnlyMockPipe } from '../../../testing/browser-only-mock.pipe';
import { SearchServiceStub } from '../../../testing/search-service.stub';
import { SearchFilterServiceStub } from '../../../testing/search-filter-service.stub';

describe('SearchFilterComponent', () => {
  let comp: SearchFilterComponent;
  let fixture: ComponentFixture<SearchFilterComponent>;
  const filterName1 = 'test name';

  const mockFilterConfig: SearchFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: filterName1,
    filterType: FilterType.text,
    hasFacets: false,
    isOpenByDefault: false
  });
  let searchFilterService: SearchFilterServiceStub;
  let sequenceService;
  const mockResults = observableOf(['test', 'data']);
  let searchService: SearchServiceStub;

  beforeEach(waitForAsync(() => {
    searchFilterService = new SearchFilterServiceStub();
    searchService = new SearchServiceStub();
    sequenceService = jasmine.createSpyObj('sequenceService', { next: 17 });

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NoopAnimationsModule],
      declarations: [
        SearchFilterComponent,
        BrowserOnlyMockPipe,
      ],
      providers: [
        { provide: SearchService, useValue: searchService },
        { provide: SearchFilterService, useValue: searchFilterService },
        { provide: SEARCH_CONFIG_SERVICE, useValue: new SearchConfigurationServiceStub() },
        { provide: SequenceService, useValue: sequenceService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).overrideComponent(SearchFilterComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    spyOn(searchService, 'getFacetValuesFor').and.returnValue(mockResults);
    fixture = TestBed.createComponent(SearchFilterComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    comp.filter = mockFilterConfig;
    fixture.detectChanges();
  });

  it('should generate unique IDs', () => {
    expect(sequenceService.next).toHaveBeenCalled();
    expect(comp.toggleId).toContain('17');
    expect(comp.regionId).toContain('17');
  });

  describe('when the toggle method is triggered', () => {
    beforeEach(() => {
      spyOn(searchFilterService, 'toggle');
      comp.toggle();
    });

    it('should call toggle with the correct filter configuration name', () => {
      expect(searchFilterService.toggle).toHaveBeenCalledWith(mockFilterConfig.name);
    });
  });

  describe('when the initializeFilter method is triggered', () => {
    beforeEach(() => {
      spyOn(searchFilterService, 'initializeFilter');
      comp.initializeFilter();
    });

    it('should call initialCollapse with the correct filter configuration name', () => {
      expect(searchFilterService.initializeFilter).toHaveBeenCalledWith(mockFilterConfig);
    });
  });

  describe('when isCollapsed is called and the filter is collapsed', () => {
    let isActive: Observable<boolean>;
    beforeEach(() => {
      searchFilterService.isCollapsed = () => observableOf(true);
      isActive = (comp as any).isCollapsed();
    });

    it('should return an observable containing true', () => {
      const sub = isActive.subscribe((value) => {
        expect(value).toBeTruthy();
      });
      sub.unsubscribe();
    });
  });

  describe('when isCollapsed is called and the filter is not collapsed', () => {
    let isActive: Observable<boolean>;
    beforeEach(() => {
      searchFilterService.isCollapsed = () => observableOf(false);
      isActive = (comp as any).isCollapsed();
    });

    it('should return an observable containing false', () => {
      const sub = isActive.subscribe((value) => {
        expect(value).toBeFalsy();
      });
      sub.unsubscribe();
    });
  });
});
