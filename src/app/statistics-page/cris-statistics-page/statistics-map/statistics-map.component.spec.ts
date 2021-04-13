import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsMapComponent } from './statistics-map.component';
import { UsageReport } from '../../../core/statistics/models/usage-report.model';
import { USAGE_REPORT } from '../../../core/statistics/models/usage-report.resource-type';

import { GoogleChartInterface } from 'ng2-google-charts';

describe('StatisticsMapComponent', () => {
  let component: StatisticsMapComponent;
  let fixture: ComponentFixture<StatisticsMapComponent>;
  const report: UsageReport = {
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
  };

  const geoChartExpected: GoogleChartInterface = {
    chartType: 'GeoChart',
    dataTable: [
      ['country','views'],
      ['United States',2],
      ['China',1]
    ],
    options: { 'title': 'TopCountries' },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticsMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  xit('geochart object should be null', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.geoChart).toBeNull();
  });

  it('geochart object should be set correctly after report object is set', () => {
    component.report = report;
    fixture.detectChanges();
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.geoChart).toEqual(geoChartExpected);
  });

});
