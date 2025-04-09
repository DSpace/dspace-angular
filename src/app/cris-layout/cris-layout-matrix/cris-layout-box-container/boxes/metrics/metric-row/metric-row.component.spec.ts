import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { MetricLoaderComponent } from '../../../../../../shared/metric/metric-loader/metric-loader.component';
import { TranslateLoaderMock } from '../../../../../../shared/mocks/translate-loader.mock';
import { metricRowsMock } from '../cris-layout-metrics-box.component.spec';
import { MetricRowComponent } from './metric-row.component';

describe('MetricRowComponent', () => {
  let component: MetricRowComponent;
  let fixture: ComponentFixture<MetricRowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), BrowserAnimationsModule, MetricRowComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(MetricRowComponent, { remove: { imports: [MetricLoaderComponent] } }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricRowComponent);
    component = fixture.componentInstance;
    component.metricRow = metricRowsMock[0] as any;
    fixture.detectChanges();
  });

  describe('When the component is rendered', () => {
    it('check metrics rendering', (done) => {
      const rowsFound = fixture.debugElement.queryAll(By.css('ds-metric-loader'));

      expect(rowsFound.length).toEqual(2);
      done();
    });
  });
});
