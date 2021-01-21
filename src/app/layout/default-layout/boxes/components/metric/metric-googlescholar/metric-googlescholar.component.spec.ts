import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricGooglescholarComponent } from './metric-googlescholar.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../../shared/mocks/translate-loader.mock';
import { metricGoogleScholarMock } from '../../../metrics/cris-layout-metrics-box.component.spec';

describe('MetricGooglescholarComponent', () => {
  let component: MetricGooglescholarComponent;
  let fixture: ComponentFixture<MetricGooglescholarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      })],
      declarations: [ MetricGooglescholarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricGooglescholarComponent);
    component = fixture.componentInstance;
    component.metric = metricGoogleScholarMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
