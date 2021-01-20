import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricDimensionsComponent } from './metric-dimensions.component';
import { metricDimensionsMock } from '../../../metrics/cris-layout-metrics-box.component.spec';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../../shared/mocks/translate-loader.mock';

describe('MetricDimensionsComponent', () => {
  let component: MetricDimensionsComponent;
  let fixture: ComponentFixture<MetricDimensionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      })],
      declarations: [ MetricDimensionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricDimensionsComponent);
    component = fixture.componentInstance;
    component.metric = metricDimensionsMock;
    component.success = true;
    component.maxRetry = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
