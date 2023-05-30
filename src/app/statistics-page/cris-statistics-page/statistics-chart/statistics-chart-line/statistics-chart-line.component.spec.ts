import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { UsageReport } from '../../../../core/statistics/models/usage-report.model';
import { USAGE_REPORT } from '../../../../core/statistics/models/usage-report.resource-type';
import { StatisticsChartLineComponent } from './statistics-chart-line.component';
import { REPORT_DATA } from '../../../../core/statistics/data-report.service';
import { ExportServiceStub } from '../../../../shared/testing/export-service.stub';
import { BrowserExportService } from '../../../../core/export-service/browser-export.service';
import { StatisticsType } from '../../statistics-type.model';

describe('StatisticsChartLineComponent', () => {
  let comp: StatisticsChartLineComponent;
  let fixture: ComponentFixture<StatisticsChartLineComponent>;
  let de: DebugElement;

  const selectedReport: UsageReport = {
        'id': '0aa1fe0c-e173-4a36-a526-5c157dedfc07_TotalVisitsPerMonth',
        'points': [
          {
            'id': 'September 2020',
            'label': 'September 2020',
            'values': {
              'views': 0
            },
            'type': 'date'
          },
          {
            'id': 'October 2020',
            'label': 'October 2020',
            'values': {
              'views': 0
            },
            'type': 'date'
          },
          {
            'id': 'November 2020',
            'label': 'November 2020',
            'values': {
              'views': 0
            },
            'type': 'date'
          },
          {
            'id': 'December 2020',
            'label': 'December 2020',
            'values': {
              'views': 0
            },
            'type': 'date'
          },
          {
            'id': 'January 2021',
            'label': 'January 2021',
            'values': {
              'views': 0
            },
            'type': 'date'
          },
          {
            'id': 'February 2021',
            'label': 'February 2021',
            'values': {
              'views': 67
            },
            'type': 'date'
          },
          {
            'id': 'March 2021',
            'label': 'March 2021',
            'values': {
              'views': 228
            },
            'type': 'date'
          }
        ],
        'type': USAGE_REPORT,
        'reportType': 'TotalVisitsPerMonth',
        'viewMode': StatisticsType['chart.line'],
        '_links': {
          'self': {
            'href': 'https://dspacecris7.4science.cloud/server/api/statistics/usagereports/0aa1fe0c-e173-4a36-a526-5c157dedfc07_TotalVisitsPerMonth'
          }
        }
    };

  const expectedResult = [
    {
      'name': 'TotalVisitsPerMonth',
      'series': [
          {
              'name': 'September 2020',
              'value': 0,
              'extra': {
                  'id': 'September 2020',
                  'label': 'September 2020',
                  'values': {
                      'views': 0
                  },
                  'type': 'date'
              }
          },
          {
              'name': 'October 2020',
              'value': 0,
              'extra': {
                  'id': 'October 2020',
                  'label': 'October 2020',
                  'values': {
                      'views': 0
                  },
                  'type': 'date'
              }
          },
          {
              'name': 'November 2020',
              'value': 0,
              'extra': {
                  'id': 'November 2020',
                  'label': 'November 2020',
                  'values': {
                      'views': 0
                  },
                  'type': 'date'
              }
          },
          {
              'name': 'December 2020',
              'value': 0,
              'extra': {
                  'id': 'December 2020',
                  'label': 'December 2020',
                  'values': {
                      'views': 0
                  },
                  'type': 'date'
              }
          },
          {
              'name': 'January 2021',
              'value': 0,
              'extra': {
                  'id': 'January 2021',
                  'label': 'January 2021',
                  'values': {
                      'views': 0
                  },
                  'type': 'date'
              }
          },
          {
              'name': 'February 2021',
              'value': 67,
              'extra': {
                  'id': 'February 2021',
                  'label': 'February 2021',
                  'values': {
                      'views': 67
                  },
                  'type': 'date'
              }
          },
          {
              'name': 'March 2021',
              'value': 228,
              'extra': {
                  'id': 'March 2021',
                  'label': 'March 2021',
                  'values': {
                      'views': 228
                  },
                  'type': 'date'
              }
          }
      ]
    }
  ];

  const page = observableOf(0);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [StatisticsChartLineComponent],
      providers: [
        { provide: REPORT_DATA, useValue: selectedReport },
        { provide: BrowserExportService, useValue: ExportServiceStub},
        { provide: 'categoryType', useValue: 'mainReports' },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(StatisticsChartLineComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsChartLineComponent);
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

