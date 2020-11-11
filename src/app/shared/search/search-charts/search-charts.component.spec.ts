import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchFilterService } from '../../../core/shared/search/search-filter.service';
import { SearchChartsComponent } from './search-charts.component';
import { SearchService } from '../../../core/shared/search/search.service';
import { of as observableOf } from 'rxjs';
import { SEARCH_CONFIG_SERVICE } from '../../../+my-dspace-page/my-dspace-page.component';
import { SearchConfigurationServiceStub } from '../../testing/search-configuration-service.stub';

describe('SearchChartsComponent', () => {
  let comp: SearchChartsComponent;
  let fixture: ComponentFixture<SearchChartsComponent>;
  let searchService: SearchService;

  const searchServiceStub = {
    /* tslint:disable:no-empty */
    getConfig: () =>
      observableOf({ hasSucceeded: true, payload: [] })
    /* tslint:enable:no-empty */
  };

  const searchFiltersStub = {
    getSelectedValuesForFilter: (filter) =>
      []
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NoopAnimationsModule],
      declarations: [SearchChartsComponent],
      providers: [
        { provide: SearchService, useValue: searchServiceStub },
        { provide: SEARCH_CONFIG_SERVICE, useValue: new SearchConfigurationServiceStub() },
        { provide: SearchFilterService, useValue: searchFiltersStub },

      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(SearchChartsComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchChartsComponent);
    comp = fixture.componentInstance; // SearchChartsComponent test instance
    fixture.detectChanges();
    searchService = (comp as any).searchService;
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

});
