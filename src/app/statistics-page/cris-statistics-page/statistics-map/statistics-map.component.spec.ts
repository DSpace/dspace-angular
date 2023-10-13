import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsMapComponent } from './statistics-map.component';
import { UsageReport } from '../../../core/statistics/models/usage-report.model';
import { USAGE_REPORT } from '../../../core/statistics/models/usage-report.resource-type';

import { GoogleChartInterface } from 'ng2-google-charts';
import { ExportService } from '../../../core/export-service/export.service';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { StatisticsType } from '../statistics-type.model';

describe('StatisticsMapComponent', () => {
  let component: StatisticsMapComponent;
  let fixture: ComponentFixture<StatisticsMapComponent>;
  const report: UsageReport = {
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
      [{ v:'US', f: 'United States' }, 2],
      [{ v:'CN', f: 'China' }, 1]
    ],
    options: { 'title': 'TopCountries' },
  };

  const exportServiceMock: any = {
    exportAsImage: jasmine.createSpy('exportAsImage'),
    exportAsFile: jasmine.createSpy('exportAsFile'),
    exportImageWithBase64: jasmine.createSpy('exportImageWithBase64')
  };

  let  exportService: ExportService = exportServiceMock;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ StatisticsMapComponent ],
      providers: [
        // { provide: ExportService, useValue: exportServiceMock }
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsMapComponent);
    component = fixture.componentInstance;
    spyOn(component, 'exportMapAsImage');
    (component as any).exportService = exportServiceMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('geochart object should be null', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.geoChart).toEqual(undefined);
  });

  it('geochart object should be set correctly after report object is set', () => {
    component.report = report;
    fixture.detectChanges();
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.geoChart).toEqual(geoChartExpected);
  });

  it('should download map as png and jpg', () => {
    component.report = report;
    component.ngOnInit();
    fixture.detectChanges();
    const drpdButton = fixture.debugElement.query(By.css('div[ngbdropdownmenu]>button[ngbdropdownitem]'));
    drpdButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.exportMapAsImage).toHaveBeenCalled();
  });
});
