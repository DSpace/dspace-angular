import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  metricEmbeddedView
} from '../../../cris-layout/cris-layout-matrix/cris-layout-box-container/boxes/metrics/cris-layout-metrics-box.component.spec';

import { MetricEmbeddedViewComponent } from './metric-embedded-view.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { APP_CONFIG } from '../../../../config/app-config.interface';
import { environment } from '../../../../environments/environment';

describe('MetricEmbeddedViewComponent', () => {
  let component: MetricEmbeddedViewComponent;
  let fixture: ComponentFixture<MetricEmbeddedViewComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      })],
      declarations: [MetricEmbeddedViewComponent],
      providers: [{ provide: APP_CONFIG, useValue: environment }],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricEmbeddedViewComponent);
    component = fixture.componentInstance;
    component.metric = metricEmbeddedView;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
