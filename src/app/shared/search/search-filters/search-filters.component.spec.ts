import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchFilterService } from '../../../core/shared/search/search-filter.service';
import { SearchFiltersComponent } from './search-filters.component';
import { SearchService } from '../../../core/shared/search/search.service';
import { of as observableOf } from 'rxjs';
import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationServiceStub } from '../../testing/search-configuration-service.stub';
import { APP_CONFIG } from '../../../../config/app-config.interface';
import { environment } from '../../../../environments/environment';
import { By } from '@angular/platform-browser';

describe('SearchFiltersComponent', () => {
  let comp: SearchFiltersComponent;
  let fixture: ComponentFixture<SearchFiltersComponent>;
  let searchService: SearchService;

  const searchServiceStub = {
    /* eslint-disable no-empty,@typescript-eslint/no-empty-function */
    getConfig: () =>
      observableOf({ hasSucceeded: true, payload: [] }),
    getClearFiltersQueryParams: () => {
    },
    getSearchLink: () => {
    }
    /* eslint-enable no-empty, @typescript-eslint/no-empty-function */
  };

  const searchFiltersStub = {
    getSelectedValuesForFilter: (filter) =>
      []
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NoopAnimationsModule],
      declarations: [SearchFiltersComponent],
      providers: [
        { provide: SearchService, useValue: searchServiceStub },
        { provide: SEARCH_CONFIG_SERVICE, useValue: new SearchConfigurationServiceStub() },
        { provide: SearchFilterService, useValue: searchFiltersStub },
        { provide: APP_CONFIG, useValue: environment },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(SearchFiltersComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFiltersComponent);
    comp = fixture.componentInstance; // SearchFiltersComponent test instance
    fixture.detectChanges();
    searchService = (comp as any).searchService;
  });

  describe('when the getSearchLink method is called', () => {
    beforeEach(() => {
      spyOn(searchService, 'getSearchLink');
      (comp as any).getSearchLink();
    });

    it('should call getSearchLink on the searchService', () => {
      expect(searchService.getSearchLink).toHaveBeenCalled();
    });
  });

  describe('when there are no filters', () => {
    beforeEach(() => {
      (comp as any).ngOnInit();
      fixture.detectChanges();
    });

    it('should not render component', () => {
      const menu = fixture.debugElement.query(By.css('div.d-none'));
      expect(menu).not.toBeNull();
      expect(comp.availableFilters).toEqual(false);
    });

  });

});
