import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { metric1Mock } from '../../../dynamic-layout/dynamic-layout-matrix/dynamic-layout-box-container/boxes/metrics/dynamic-layout-metrics-box.component.spec';
import { MetricDefaultComponent } from './metric-default.component';

describe('MetricDspacecrisComponent', () => {
  let component: MetricDefaultComponent;
  let fixture: ComponentFixture<MetricDefaultComponent>;

  beforeEach(waitForAsync(() => {
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
