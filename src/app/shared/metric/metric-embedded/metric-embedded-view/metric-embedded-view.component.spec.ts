import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { APP_CONFIG } from '../../../../../config/app-config.interface';
import { environment } from '../../../../../environments/environment.test';
import { metricEmbeddedView } from '../../../../cris-layout/cris-layout-matrix/cris-layout-box-container/boxes/metrics/cris-layout-metrics-box.component.spec';
import { TranslateLoaderMock } from '../../../mocks/translate-loader.mock';
import { MetricEmbeddedViewComponent } from './metric-embedded-view.component';

describe('MetricEmbeddedViewComponent', () => {
  let component: MetricEmbeddedViewComponent;
  let fixture: ComponentFixture<MetricEmbeddedViewComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), MetricEmbeddedViewComponent],
      providers: [
        { provide: APP_CONFIG, useValue: environment },
      ],
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
