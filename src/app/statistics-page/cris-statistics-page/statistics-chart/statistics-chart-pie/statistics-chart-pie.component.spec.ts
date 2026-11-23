import { DOCUMENT } from '@angular/common';
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
import { BrowserExportService } from '@dspace/core/export-service/browser-export.service';
import { REPORT_DATA } from '@dspace/core/statistics/data-report.service';
import { UsageReport } from '@dspace/core/statistics/models/usage-report.model';
import { USAGE_REPORT } from '@dspace/core/statistics/models/usage-report.resource-type';
import { ExportServiceStub } from '@dspace/core/testing/export-service.stub';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import {
  NativeWindowRef,
  NativeWindowService,
} from 'src/app/core/services/window.service';

import { StatisticsType } from '../../statistics-type.model';
import { StatisticsChartPieComponent } from './statistics-chart-pie.component';


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
          'downloads': 8,
        },
      },
    ],
    '_links' : {
      'self' : {
        'href' : 'https://{dspace.url}/server/api/statistics/usagereports/1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits',
      },
    },
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
          'downloads': 8,
        },
      },
    },
  ];

  const page = of(0);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), StatisticsChartPieComponent],
      providers: [
        { provide: REPORT_DATA, useValue: selectedReport },
        { provide: BrowserExportService, useValue: ExportServiceStub },
        { provide: 'categoryType', useValue: 'mainReports' },
        { provide: NativeWindowService, useValue: new NativeWindowRef() },
        { provide: DOCUMENT, useValue: document },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(StatisticsChartPieComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
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

