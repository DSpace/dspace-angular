import { ComponentFixture, TestBed } from '@angular/core/testing';
import { metricEmbeddedView } from '../../../metrics/cris-layout-metrics-box.component.spec';

import { MetricEmbeddedViewComponent } from './metric-embedded-view.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateLoaderMock} from '../../../../../../shared/mocks/translate-loader.mock';

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
      declarations: [ MetricEmbeddedViewComponent ]
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
