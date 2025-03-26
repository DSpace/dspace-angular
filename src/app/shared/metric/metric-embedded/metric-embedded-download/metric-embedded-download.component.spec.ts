import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricEmbeddedDownloadComponent } from './metric-embedded-download.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../mocks/translate-loader.mock';
import {
  metricEmbeddedDownload
} from '../../../../cris-layout/cris-layout-matrix/cris-layout-box-container/boxes/metrics/cris-layout-metrics-box.component.spec';
import { Metric } from '../../../../core/shared/metric.model';

describe('MetricEmbeddedDownloadComponent', () => {
  let component: MetricEmbeddedDownloadComponent;
  let fixture: ComponentFixture<MetricEmbeddedDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      })],
      declarations: [MetricEmbeddedDownloadComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricEmbeddedDownloadComponent);
    component = fixture.componentInstance;
    component.metric = metricEmbeddedDownload;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should append reportType to href if href is defined and does not contain query parameters', () => {
    component.href = 'http://example.com';
    component.metric = {} as Metric;
    component.ngOnInit();
    expect(component.href).toBe('http://example.com?reportType=TotalDownloads');
  });

  it('should append reportType to href if href is defined and contains query parameters', () => {
    component.href = 'http://example.com?param=value';
    component.metric = {} as Metric;
    component.ngOnInit();
    expect(component.href).toBe('http://example.com?param=value&reportType=TotalDownloads');
  });

  it('should not modify href if href is not defined', () => {
    component.href = undefined;
    component.metric = {} as Metric;
    component.ngOnInit();
    expect(component.href).toBeUndefined();
  });
});
