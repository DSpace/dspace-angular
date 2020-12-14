import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderMock } from 'src/app/shared/mocks/translate-loader.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MetricRowComponent } from "./metric-row.component";
import { MetricComponent } from "../metric/metric.component";
import { metricRowsMock } from "../../metrics/cris-layout-metrics-box.component.spec";
import { By } from "@angular/platform-browser";

describe('MetricRowComponent', () => {
  let component: MetricRowComponent;
  let fixture: ComponentFixture<MetricRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }), BrowserAnimationsModule],
      declarations: [
        MetricRowComponent,
        MetricComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricRowComponent);
    component = fixture.componentInstance;
    component.metricRow = metricRowsMock[0] as any;
    fixture.detectChanges();
  });

  describe('When the component is rendered', () => {
    fit('check metrics rendering', (done) => {
      const rowsFound = fixture.debugElement.queryAll(By.css('ds-metric'));

      expect(rowsFound.length).toEqual(2);
      done()
    });
  });
});
