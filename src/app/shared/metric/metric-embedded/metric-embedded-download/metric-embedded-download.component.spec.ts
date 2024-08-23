import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { metricEmbeddedDownload } from '../../../../cris-layout/cris-layout-matrix/cris-layout-box-container/boxes/metrics/cris-layout-metrics-box.component.spec';
import { TranslateLoaderMock } from '../../../mocks/translate-loader.mock';
import { MetricEmbeddedDownloadComponent } from './metric-embedded-download.component';

describe('MetricEmbeddedDownloadComponent', () => {
  let component: MetricEmbeddedDownloadComponent;
  let fixture: ComponentFixture<MetricEmbeddedDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), MetricEmbeddedDownloadComponent],
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
});
