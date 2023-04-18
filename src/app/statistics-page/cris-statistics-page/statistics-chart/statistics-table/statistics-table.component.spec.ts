import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDetectionStrategy, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { StatisticsTableComponent } from './statistics-table.component';
import { UsageReport } from '../../../../core/statistics/models/usage-report.model';
import { USAGE_REPORT } from '../../../../core/statistics/models/usage-report.resource-type';
import { REPORT_DATA } from '../../../../core/statistics/data-report.service';
import { BrowserExportService } from '../../../../core/export-service/browser-export.service';
import { ExportServiceStub } from '../../../../shared/testing/export-service.stub';


import { TranslateModule } from '@ngx-translate/core';

import { By } from '@angular/platform-browser';
import { StatisticsType } from '../../statistics-type.model';


describe('StatisticsTableComponent', () => {
  let component: StatisticsTableComponent;
  let fixture: ComponentFixture<StatisticsTableComponent>;
  let de: DebugElement;

  const report: UsageReport = {
      'id': '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TopCountries',
      'type': USAGE_REPORT,
      'reportType': 'TopCountries',
      'viewMode': StatisticsType.table,
      'points': [
          {
              'label': 'United States',
              'type': 'country',
              'id': 'US',
              'values': {
                  'views': 2
              }
          },
          {
              'label': 'China',
              'type': 'country',
              'id': 'CN',
              'values': {
                  'views': 1
              }
          }
      ],
      '_links' : {
        'self' : {
          'href' : 'https://{dspace.url}/server/api/statistics/usagereports/1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits'
        }
      }
  };
  const reportdata: UsageReport = {
      'id': '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TopCountries',
      'type': USAGE_REPORT,
      'reportType': 'TopCountries',
      'viewMode': StatisticsType.table,
      'points': [
          {
              'label': 'United States',
              'type': 'country',
              'id': 'US',
              'values': {
                  'views': 2
              }
          },
          {
              'label': 'China',
              'type': 'country',
              'id': 'CN',
              'values': {
                  'views': 1
              }
          }
      ],
      '_links' : {
        'self' : {
          'href' : 'https://{dspace.url}/server/api/statistics/usagereports/1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits'
        }
      }
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [StatisticsTableComponent],
      providers: [
        { provide: REPORT_DATA, useValue: report},
        { provide: BrowserExportService, useValue: ExportServiceStub},
        { provide: 'categoryType', useValue: 'mainReports' },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(StatisticsTableComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsTableComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.report = {
      'id': '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TopCountries',
      type : USAGE_REPORT,
      reportType: 'TopCountries',
      viewMode: StatisticsType.table,
      points: [],
      '_links' : {
        'self' : {
          'href' : 'https://{dspace.url}/server/api/statistics/usagereports/1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits'
        }
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the report is empty', () => {

    it ('should not display a table', () => {
      expect(de.query(By.css('table'))).toBeNull();
    });
  });

  describe('when the report has data', () => {
    it ('should display a table with the correct data', () => {

      component.report = reportdata;
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      expect(de.query(By.css('table'))).toBeTruthy();

      expect(de.query(By.css('th.country-header')).nativeElement.innerText)
        .toEqual('statistics.table.mainReports.header.country');
      expect(de.query(By.css('th.views-header')).nativeElement.innerText)
        .toEqual('statistics.table.mainReports.header.views');

      expect(de.query(By.css('td.US-views-data')).nativeElement.innerText)
        .toEqual('2');
      expect(de.query(By.css('td.CN-views-data')).nativeElement.innerText)
        .toEqual('1');
    });
  });
});
