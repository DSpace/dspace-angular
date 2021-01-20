import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricAltmetricComponent } from './metric-altmetric.component';
import { metricAltmetricMock } from '../../../metrics/cris-layout-metrics-box.component.spec';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../../shared/mocks/translate-loader.mock';

describe('MetricAltmetricComponent', () => {
  let component: MetricAltmetricComponent;
  let fixture: ComponentFixture<MetricAltmetricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      })],
      declarations: [ MetricAltmetricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricAltmetricComponent);
    component = fixture.componentInstance;
    component.metric = metricAltmetricMock;
    component.success = true;
    component.maxRetry = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
