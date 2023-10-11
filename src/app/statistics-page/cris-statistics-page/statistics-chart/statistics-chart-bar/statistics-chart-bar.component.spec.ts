import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { By } from '@angular/platform-browser';
import { StatisticsChartBarComponent } from './statistics-chart-bar.component';
import { UsageReport } from '../../../../core/statistics/models/usage-report.model';
import { USAGE_REPORT } from '../../../../core/statistics/models/usage-report.resource-type';
import { REPORT_DATA } from '../../../../core/statistics/data-report.service';
import { BrowserExportService } from '../../../../core/export-service/browser-export.service';
import { ExportServiceStub } from '../../../../shared/testing/export-service.stub';
import { CommonModule } from '@angular/common';
import { StatisticsType } from '../../statistics-type.model';


describe('StatisticsChartBarComponent', () => {
  let comp: StatisticsChartBarComponent;
  let fixture: ComponentFixture<StatisticsChartBarComponent>;
  let de: DebugElement;

  const selectedReport: UsageReport = {
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
          'views': 3
        }
      }
    ],
    '_links': {
      'self': {
        'href': 'https://{dspace.url}/server/api/statistics/usagereports/1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits'
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

  const page = observableOf(0);
  const exportServiceStub = new ExportServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), CommonModule],
      declarations: [StatisticsChartBarComponent],
      providers: [
        { provide: REPORT_DATA, useValue: selectedReport },
        { provide: BrowserExportService, useValue: exportServiceStub },
        { provide: 'categoryType', useValue: 'mainReports' },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsChartBarComponent);
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

      comp.getInitData().subscribe((result) => {
        expect(result).toEqual(expectedResult);
        done();
      });
    });
  });


});
