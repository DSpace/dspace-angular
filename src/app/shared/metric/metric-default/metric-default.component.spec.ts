import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { metric1Mock } from '../../../cris-layout/cris-layout-matrix/cris-layout-box-container/boxes/metrics/cris-layout-metrics-box.component.spec';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { MetricDefaultComponent } from './metric-default.component';

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
        MetricDefaultComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
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
