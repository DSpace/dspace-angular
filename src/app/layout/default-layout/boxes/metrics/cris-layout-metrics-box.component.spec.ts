import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Observable, of } from 'rxjs';
import { RemoteData } from 'src/app/core/data/remote-data';
import { createSuccessfulRemoteDataObject } from 'src/app/shared/remote-data.utils';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from 'src/app/shared/mocks/translate-loader.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CrisLayoutLoaderDirective } from 'src/app/layout/directives/cris-layout-loader.directive';
import { RowComponent } from '../components/row/row.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { boxMetadata } from 'src/app/shared/testing/box.mock';
import { TextComponent } from '../components/text/text.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CrisLayoutMetricsBoxComponent } from "./cris-layout-metrics-box.component";
import { metricsComponent } from "../../../../shared/testing/metrics-components.mock";
import { MetricsComponent } from "../../../../core/layout/models/metrics-component.model";
import { MetricsComponentsDataService } from "../../../../core/layout/metrics-components-data.service";

export const metric1Mock = {
  acquisitionDate: new Date(),
  deltaPeriod1: null,
  deltaPeriod2: null,
  endDate: null,
  id: 1,
  last: true,
  metricCount: 333,
  metricType: "views",
  rank: null,
  remark: null,
  startDate: null,
  type: null
};

export const metric2Mock = { ...metric1Mock, metricType: 'downloads' };

export const metricRowsMock = [{
  metrics: [metric1Mock, metric2Mock]
}];

// tslint:disable-next-line: max-classes-per-file
class MetricsComponentsDataServiceMock {
  findById(boxShortname: string): Observable<RemoteData<MetricsComponent>> {
    return of(
      createSuccessfulRemoteDataObject(metricsComponent)
    );
  }
}

describe('CrisLayoutMetricsBoxComponent', () => {
  let component: CrisLayoutMetricsBoxComponent;
  let fixture: ComponentFixture<CrisLayoutMetricsBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }),
      BrowserAnimationsModule,
      SharedModule],
      providers: [
        { provide: MetricsComponentsDataService, useClass: MetricsComponentsDataServiceMock },
      ],
      declarations: [
        CrisLayoutMetricsBoxComponent,
        CrisLayoutLoaderDirective,
        RowComponent,
        TextComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(CrisLayoutMetricsBoxComponent, {
      set: {
        entryComponents: [TextComponent]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutMetricsBoxComponent);
    component = fixture.componentInstance;
    component.item = {
      metrics: [metric1Mock, metric2Mock]
    } as any;

    component.box = boxMetadata;
    component.metricRows = metricRowsMock as any;
    component.metricscomponents = metricsComponent;
    fixture.detectChanges();
  });

  fit('check metrics rows rendering', (done) => {
    const rowsFound = fixture.debugElement.queryAll(By.css('div[ds-metric-row]'));

    expect(rowsFound.length).toEqual(1);
    done()
  });
});
