import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { TranslateModule } from '@ngx-translate/core';

import { SearchChartsComponent } from './search-charts.component';
import { SearchService } from '../../../core/shared/search/search.service';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { SearchFilterConfig } from '../models/search-filter-config.model';
import { FilterType } from '../models/filter-type.model';

describe('SearchChartsComponent', () => {
  let comp: SearchChartsComponent;
  let fixture: ComponentFixture<SearchChartsComponent>;
  let searchService: SearchService;

  const mockGraphPieChartFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: 'dateIssued',
    filterType: FilterType['chart.pie']
  });

  const mockGraphBarChartFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: 'type',
    filterType: FilterType['chart.bar']
  });

  const mockChartFilters$ = createSuccessfulRemoteDataObject$([mockGraphPieChartFilterConfig, mockGraphBarChartFilterConfig]);

  const searchServiceStub = jasmine.createSpyObj('SearchService', {
    getConfig: jasmine.createSpy('getConfig')
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule],
      declarations: [SearchChartsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchChartsComponent);
    comp = fixture.componentInstance; // SearchChartsComponent test instance
    comp.filters = mockChartFilters$;
    fixture.detectChanges();
  });

  it('should create', () => {
    const charts = fixture.debugElement.query(By.css('[data-test="search-charts"]'));
    const toggle = fixture.debugElement.query(By.css('[data-test="search-charts-toggle"]'));
    const chartTabs = fixture.debugElement.queryAll(By.css('[data-test="search-charts-tab"]'));
    expect(comp).toBeTruthy();
    expect(charts).toBeTruthy();
    expect(toggle).toBeFalsy();
    expect(chartTabs.length).toBe(2);
    expect(comp.selectedFilter).toEqual(mockGraphPieChartFilterConfig);
  });

  it('should call changeChartType and set the selected filter', () => {
    comp.changeChartType(mockGraphBarChartFilterConfig);
    expect(comp.selectedFilter).toEqual(mockGraphBarChartFilterConfig);
  });

  it('should show toggle when showChartsToggle is true', () => {
    comp.showChartsToggle = true;
    fixture.detectChanges();
    const charts = fixture.debugElement.query(By.css('[data-test="search-charts"]'));
    const toggle = fixture.debugElement.query(By.css('[data-test="search-charts-toggle"]'));

    expect(charts).toBeTruthy();
    expect(toggle).toBeTruthy();
  });

  it('should not show charts when collapseChart is true', fakeAsync(() => {
    comp.collapseChart = true;
    fixture.detectChanges();
    tick();
    const charts = fixture.debugElement.query(By.css('[data-test="search-charts"]'));

    expect(comp.collapseChart).toBeTrue();
    expect(charts).toBeFalsy();
  }));

});
