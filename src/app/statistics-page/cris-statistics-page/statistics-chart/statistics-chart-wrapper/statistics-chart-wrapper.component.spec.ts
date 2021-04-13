import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StatisticsChartWrapperComponent } from './statistics-chart-wrapper.component';
import { UsageReport,Point } from '../../../../core/statistics/models/usage-report.model';
import { REPORT_DATA } from '../../../../core/statistics/data-report.service';
import { USAGE_REPORT } from '../../../../core/statistics/models/usage-report.resource-type';
import { StatisticsType } from '../../statistics-type.model';
import { ExportServiceStub } from '../../../../shared/testing/export-service.stub';
import { ExportService } from '../../../../core/export-service/export.service';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { StatisticsChartBarComponent } from '../statistics-chart-bar/statistics-chart-bar.component';


describe('StatisticsChartWrapperComponent', () => {
  let component: StatisticsChartWrapperComponent;
  let fixture: ComponentFixture<StatisticsChartWrapperComponent>;
  // const statisticsType = new StatisticsType();

  const report: UsageReport = {
      'id': '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits',
      'type': USAGE_REPORT,
      'reportType': 'TotalVisits',
      'viewMode': 'chart.bar',
      'points': [
          {
              'label': '1911e8a4-6939-490c-b58b-a5d70f8d91fb',
              'type': 'item',
              'id': '1911e8a4-6939-490c-b58b-a5d70f8d91fb',
              'values': {
                  'views': 3
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
      imports: [
        // BrowserAnimationsModule
      ],
      declarations: [
        StatisticsChartWrapperComponent,
        StatisticsChartBarComponent
      ],
      providers: [
        { provide: REPORT_DATA, useValue: report},
        { provide: ExportService, useValue: ExportServiceStub},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsChartWrapperComponent);
    component = fixture.componentInstance;
    component.report = report;
    component.type = StatisticsType[report.viewMode];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should inject component properly', () => {
    spyOn(component, 'getStatistics').and.callThrough();
  });


});
