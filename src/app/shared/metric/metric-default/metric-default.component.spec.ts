import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricDefaultComponent } from './metric-default.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import {
  metric1Mock
} from '../../../cris-layout/cris-layout-matrix/cris-layout-box-container/boxes/metrics/cris-layout-metrics-box.component.spec';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { APP_CONFIG } from '../../../../config/app-config.interface';
import { environment } from '../../../../environments/environment';

describe('MetricDspacecrisComponent', () => {
  let component: MetricDefaultComponent;
  let fixture: ComponentFixture<MetricDefaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ],
      declarations: [MetricDefaultComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: APP_CONFIG, useValue: environment }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricDefaultComponent);
    component = fixture.componentInstance;
    component.metric = metric1Mock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
