import { ChangeDetectionStrategy, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { StatisticsChartComponent } from './statistics-chart.component';
import { USAGE_REPORT } from '../../../core/statistics/models/usage-report.resource-type';
import { UsageReport } from '../../../core/statistics/models/usage-report.model';
import { StatisticsPipesPageModule } from '../statistics-pipes/statistics-pipes.module';

import { By } from '@angular/platform-browser';


describe('StatisticsChartComponent', () => {
  let component: StatisticsChartComponent;
  let fixture: ComponentFixture<StatisticsChartComponent>;
  let de: DebugElement;

  const reports: UsageReport[] = [{
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
            },
            {
                'id': '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisitsPerMonth',
                'type': USAGE_REPORT,
                'reportType': 'TotalVisitsPerMonth',
                'viewMode': 'chart.line',
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
                      'views': 234
                    },
                    'type': 'date'
                  }
                ],
                '_links' : {
                  'self' : {
                    'href' : 'https://{dspace.url}/server/api/statistics/usagereports/1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits'
                  }
                }
            },
            {
                'id': '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalDownloads',
                'type': USAGE_REPORT,
                'reportType': 'TotalDownloads',
                'viewMode': 'chart.pie',
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
            },
            {
                'id': '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TopCountries',
                'type': USAGE_REPORT,
                'reportType': 'TopCountries',
                'viewMode': 'map',
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
            }
        ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), StatisticsPipesPageModule],
      declarations: [StatisticsChartComponent],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(StatisticsChartComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
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

  it('after reports check if container of pills are truthly', () => {
    component.reports = reports;
    fixture.detectChanges();
    expect(de.query(By.css('.container'))).toBeTruthy();
  });

});
