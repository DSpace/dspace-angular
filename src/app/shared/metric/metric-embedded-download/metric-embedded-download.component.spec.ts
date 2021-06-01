import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricEmbeddedDownloadComponent } from './metric-embedded-download.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateLoaderMock} from '../../mocks/translate-loader.mock';
import {metricEmbeddedDownload, metricEmbeddedView} from '../../../layout/default-layout/boxes/metrics/cris-layout-metrics-box.component.spec';

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
      declarations: [ MetricEmbeddedDownloadComponent ]
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
