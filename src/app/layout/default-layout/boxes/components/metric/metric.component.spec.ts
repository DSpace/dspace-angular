import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderMock } from 'src/app/shared/mocks/translate-loader.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MetricComponent } from "../metric/metric.component";
import { metric1Mock } from "../../metrics/cris-layout-metrics-box.component.spec";
import { By } from "@angular/platform-browser";

describe('MetricComponent', () => {
  let component: MetricComponent;
  let fixture: ComponentFixture<MetricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }), BrowserAnimationsModule],
      declarations: [
        MetricComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricComponent);
    component = fixture.componentInstance;
    component.metric = metric1Mock as any;
    fixture.detectChanges();
  });

  describe('When the component is rendered', () => {
    fit('check metric data rendered', (done) => {
      const rowsFound = fixture.debugElement.queryAll(By.css('.metric-container'));

      expect(rowsFound.length).toEqual(1);
      done()
    });
  });
});
