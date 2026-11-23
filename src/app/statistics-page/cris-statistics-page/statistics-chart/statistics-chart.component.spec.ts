import {
  ChangeDetectionStrategy,
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { APP_DATA_SERVICES_MAP } from '@dspace/core/data-services-map-type';
import { UsageReport } from '@dspace/core/statistics/models/usage-report.model';
import { USAGE_REPORT } from '@dspace/core/statistics/models/usage-report.resource-type';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import { StatisticsType } from '../statistics-type.model';
import { StatisticsChartComponent } from './statistics-chart.component';
import { StatisticsChartWrapperComponent } from './statistics-chart-wrapper/statistics-chart-wrapper.component';


describe('StatisticsChartComponent', () => {
  let component: StatisticsChartComponent;
  let fixture: ComponentFixture<StatisticsChartComponent>;
  let de: DebugElement;

  const reports: UsageReport[] = [{
    'id': '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits',
    'type': USAGE_REPORT,
    'reportType': 'TotalVisits',
    'viewMode': StatisticsType['chart.bar'],
    'points': [
      {
        'label': '1911e8a4-6939-490c-b58b-a5d70f8d91fb',
        'type': 'item',
        'id': '1911e8a4-6939-490c-b58b-a5d70f8d91fb',
        'values': {
          'views': 3,
        },
      },
    ],
    '_links' : {
      'self' : {
        'href' : 'https://{dspace.url}/server/api/statistics/usagereports/1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits',
      },
    },
  },
  {
    'id': '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisitsPerMonth',
    'type': USAGE_REPORT,
    'reportType': 'TotalVisitsPerMonth',
    'viewMode': StatisticsType['chart.line'],
    'points': [
      {
        'id': 'September 2020',
        'label': 'September 2020',
        'values': {
          'views': 0,
        },
        'type': 'date',
      },
      {
        'id': 'October 2020',
        'label': 'October 2020',
        'values': {
          'views': 0,
        },
        'type': 'date',
      },
      {
        'id': 'November 2020',
        'label': 'November 2020',
        'values': {
          'views': 0,
        },
        'type': 'date',
      },
      {
        'id': 'December 2020',
        'label': 'December 2020',
        'values': {
          'views': 0,
        },
        'type': 'date',
      },
      {
        'id': 'January 2021',
        'label': 'January 2021',
        'values': {
          'views': 0,
        },
        'type': 'date',
      },
      {
        'id': 'February 2021',
        'label': 'February 2021',
        'values': {
          'views': 67,
        },
        'type': 'date',
      },
      {
        'id': 'March 2021',
        'label': 'March 2021',
        'values': {
          'views': 234,
        },
        'type': 'date',
      },
    ],
    '_links' : {
      'self' : {
        'href' : 'https://{dspace.url}/server/api/statistics/usagereports/1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits',
      },
    },
  },
  {
    'id': '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalDownloads',
    'type': USAGE_REPORT,
    'reportType': 'TotalDownloads',
    'viewMode': StatisticsType['chart.pie'],
    'points': [
      {
        'label': '8d33bdfb-e7ba-43e6-a93a-f445b7e8a1e2',
        'type': 'bitstream',
        'id': '8d33bdfb-e7ba-43e6-a93a-f445b7e8a1e2',
        'values': {
          'downloads': 8,
        },
      },
    ],
    '_links' : {
      'self' : {
        'href' : 'https://{dspace.url}/server/api/statistics/usagereports/1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits',
      },
    },
  },
  {
    'id': '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TopCountries',
    'type': USAGE_REPORT,
    'reportType': 'TopCountries',
    'viewMode': StatisticsType.map,
    'points': [
      {
        'label': 'United States',
        'type': 'country',
        'id': 'US',
        'values': {
          'views': 2,
        },
      },
      {
        'label': 'China',
        'type': 'country',
        'id': 'CN',
        'values': {
          'views': 1,
        },
      },
    ],
    '_links' : {
      'self' : {
        'href' : 'https://{dspace.url}/server/api/statistics/usagereports/1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits',
      },
    },
  },
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), StatisticsChartComponent],
      providers: [
        provideMockStore(),
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        { provide: APP_CONFIG, useValue: environment },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(StatisticsChartComponent, {
      add: { changeDetection: ChangeDetectionStrategy.Default },
      remove: {
        imports: [
          ThemedLoadingComponent,
          StatisticsChartWrapperComponent,
        ],
      },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsChartComponent);
    de = fixture.debugElement;
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });


  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('check if container is null', () => {
    expect(de.query(By.css('.container'))).toBeNull();
  });

  it('after reports check if container of pills are truthy', () => {
    component.reports = reports;
    fixture.detectChanges();
    expect(de.query(By.css('.container'))).toBeTruthy();
  });

  it('should set selectedReport to the report matching selectedReportId', () => {
    component.reports = reports;
    component.selectedReportId = '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits';
    component.ngOnInit();
    expect(component.selectedReport$.value.id).toBe('1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits');
  });

  it('should set selectedReport to the first report if selectedReportId does not match any report', () => {
    component.reports = reports;
    component.selectedReportId = 'non_existing_id';
    component.ngOnInit();
    expect(component.selectedReport$.value.id).toBe('1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits');
  });

  it('should emit changeReportEvent with the first report id if selectedReportId does not match any report', () => {
    spyOn(component.changeReportEvent, 'emit');
    component.reports = reports;
    component.selectedReportId = 'non_existing_id';
    component.ngOnInit();
    expect(component.changeReportEvent.emit).toHaveBeenCalledWith('1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits');
  });

  it('should call addQueryParams with the reportType of the selected report', () => {
    spyOn(component, 'addQueryParams');
    component.reports = reports;
    component.selectedReportId = '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits';
    component.ngOnInit();
    expect(component.addQueryParams).toHaveBeenCalledWith('TotalVisits');
  });

  it('should not set selectedReport if reports is null', () => {
    component.reports = undefined;
    component.ngOnInit();
    expect(component.selectedReport$.value).toBeNull();
  });

  it('should not set selectedReport if reports is empty', () => {
    component.reports = [];
    component.ngOnInit();
    expect(component.selectedReport$.value).toBeNull();
  });

  it('should update selectedReport and emit changeReportEvent on changeReport', () => {
    spyOn(component.changeReportEvent, 'emit');
    const newReport = reports[1];
    component.changeReport(newReport);
    expect(component.selectedReport$.value).toBe(newReport);
    expect(component.changeReportEvent.emit).toHaveBeenCalledWith(newReport.id);
  });

  it('should call addQueryParams with the reportType of the new report on changeReport', () => {
    spyOn(component, 'addQueryParams');
    const newReport = reports[1];
    component.changeReport(newReport);
    expect(component.addQueryParams).toHaveBeenCalledWith(newReport.reportType);
  });

  it('should show ds-loading while selectedFullReport observable has not emitted a report yet', () => {
    component.reports = reports;
    component.selectedReportId = reports[0].id;
    component.selectedFullReport = new BehaviorSubject<UsageReport>(null);
    component.ngOnInit();
    fixture.detectChanges();

    expect(de.query(By.css('ds-loading'))).toBeTruthy();
    expect(de.query(By.css('ds-statistics-chart-wrapper'))).toBeNull();
  });

  it('should show ds-statistics-chart-wrapper once selectedFullReport observable emits a report', () => {
    component.reports = reports;
    component.selectedReportId = reports[0].id;
    const selectedFullReportSubject = new BehaviorSubject<UsageReport>(null);
    component.selectedFullReport = selectedFullReportSubject;
    component.ngOnInit();
    fixture.detectChanges();

    selectedFullReportSubject.next(reports[0]);
    fixture.detectChanges();

    expect(de.query(By.css('ds-loading'))).toBeNull();
    expect(de.query(By.css('ds-statistics-chart-wrapper'))).toBeTruthy();
  });

});
