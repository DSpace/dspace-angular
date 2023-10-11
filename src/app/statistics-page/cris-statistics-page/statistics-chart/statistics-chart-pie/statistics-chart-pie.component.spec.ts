import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { UsageReport } from '../../../../core/statistics/models/usage-report.model';
import { USAGE_REPORT } from '../../../../core/statistics/models/usage-report.resource-type';
import { REPORT_DATA } from '../../../../core/statistics/data-report.service';

import { BrowserExportService } from '../../../../core/export-service/browser-export.service';
import { ExportServiceStub } from '../../../../shared/testing/export-service.stub';
import { StatisticsChartPieComponent } from './statistics-chart-pie.component';
import { StatisticsType } from '../../statistics-type.model';


describe('StatisticsChartPieComponent', () => {
  let comp: StatisticsChartPieComponent;
  let fixture: ComponentFixture<StatisticsChartPieComponent>;
  let de: DebugElement;

  const selectedReport: UsageReport = {
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
                'downloads': 8
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
      'name': '8d33bdfb-e7ba-43e6-a93a-f445b7e8a1e2',
      'value': 8,
      'extra': {
        'label': '8d33bdfb-e7ba-43e6-a93a-f445b7e8a1e2',
        'type': 'bitstream',
        'id': '8d33bdfb-e7ba-43e6-a93a-f445b7e8a1e2',
        'values': {
            'downloads': 8
        }
      }
    }
  ];

  const page = observableOf(0);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [StatisticsChartPieComponent],
      providers: [
        { provide: REPORT_DATA, useValue: selectedReport },
        { provide: BrowserExportService, useValue: ExportServiceStub },
        { provide: 'categoryType', useValue: 'mainReports' },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(StatisticsChartPieComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsChartPieComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('check if export section is set', () => {
    it('Export section is available', () => {
      expect(de.query(By.css('.export-buttons-container'))).toBeTruthy();
    });
  });


  describe('check function getInitData', () => {
    it('check if the information is parsed correctly', (done: DoneFn) => {
      comp.report = selectedReport;
      fixture.detectChanges();

      comp.getInitData().subscribe( (result) => {
        expect(result).toEqual(expectedResult);
        done();
      });
    });
  });


});

