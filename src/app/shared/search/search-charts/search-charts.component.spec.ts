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
import { Observable, of as observableOf } from 'rxjs';
import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationServiceStub } from '../../testing/search-configuration-service.stub';
import { FacetValue } from '../models/facet-value.model';
import { RemoteData } from './../../../core/data/remote-data';

describe('SearchChartsComponent', () => {
  let comp: SearchChartsComponent;
  let fixture: ComponentFixture<SearchChartsComponent>;
  let searchConfigService = new SearchConfigurationServiceStub();

  const mockGraphPieChartFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: 'dateIssued',
    filterType: FilterType['chart.pie']
  });

  const mockGraphBarChartFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: 'type',
    filterType: FilterType['chart.bar']
  });

  const mockChartFilters$ = createSuccessfulRemoteDataObject$([mockGraphPieChartFilterConfig, mockGraphBarChartFilterConfig]);
  const values: FacetValue[] = [Object.assign(new FacetValue(), {
    label: 'value1',
    value: 'value1',
    count: 52,
    _links: {
      self: {
        href: ''
      },
      search: {
        href: ''
      }
    }
  })];

  const mockValues: Observable<RemoteData<FacetValue[]>> = createSuccessfulRemoteDataObject$(values);
  const searchServiceStub = jasmine.createSpyObj('SearchService', {
    getConfig: jasmine.createSpy('getConfig'),
    getFacetValuesFor: (filter) => mockValues
  });

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule],
      declarations: [SearchChartsComponent],
      providers: [
        { provide: SearchService, useValue: searchServiceStub },
        { provide: SEARCH_CONFIG_SERVICE, useValue: searchConfigService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchChartsComponent);
    comp = fixture.componentInstance; // SearchChartsComponent test instance
    comp.filters = mockChartFilters$;
    spyOn(comp, 'hasFacetValues').and.returnValue(observableOf(true));
    fixture.detectChanges();
  });

  it('should create', () => {
    comp.hasFacetValues(mockGraphPieChartFilterConfig);
    fixture.detectChanges();
    const charts = fixture.debugElement.query(By.css('[data-test="search-charts"]'));
    const toggle = fixture.debugElement.query(By.css('[data-test="search-charts-toggle"]'));
    const chartTabs = fixture.debugElement.queryAll(By.css('[data-test="search-charts-tab"]'));
    expect(comp).toBeTruthy();
    expect(charts).toBeTruthy();
    expect(toggle).toBeFalsy();
    expect(chartTabs.length).toBe(2);
    expect(comp.selectedFilter).toEqual(mockGraphPieChartFilterConfig);
  });

  it('should call hasFacetValues return true for valid filter config with facet values', () => {
    comp.hasFacetValues(mockGraphBarChartFilterConfig).subscribe((result) => {
      expect(result).toBeTruthy();
    });
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

  afterEach(() => {
    comp = null;
  });
});
