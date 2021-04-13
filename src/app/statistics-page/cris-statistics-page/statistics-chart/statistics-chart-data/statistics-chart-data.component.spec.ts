import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { Router } from '@angular/router';
import { StatisticsChartDataComponent } from './statistics-chart-data.component';
import { UsageReport } from '../../../../core/statistics/models/usage-report.model';
import { USAGE_REPORT } from '../../../../core/statistics/models/usage-report.resource-type';
import { REPORT_DATA } from '../../../../core/statistics/data-report.service';
import { ExportServiceStub } from '../../../../shared/testing/export-service.stub';
import { ExportService } from '../../../../core/export-service/export.service';

describe('StatisticsChartDataComponent', () => {
  let comp: StatisticsChartDataComponent;
  let fixture: ComponentFixture<StatisticsChartDataComponent>;
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

  const expectedResult = [
    {
      name: '1911e8a4-6939-490c-b58b-a5d70f8d91fb',
      value: 3,
      extra: {
        'label': '1911e8a4-6939-490c-b58b-a5d70f8d91fb',
        'type': 'item',
        'id': '1911e8a4-6939-490c-b58b-a5d70f8d91fb',
        'values': {
            'views': 3
        }
      },
    }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [StatisticsChartDataComponent],
      providers: [
        { provide: REPORT_DATA, useValue: report },
        { provide: ExportService, useValue: ExportServiceStub},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(StatisticsChartDataComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsChartDataComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

});
