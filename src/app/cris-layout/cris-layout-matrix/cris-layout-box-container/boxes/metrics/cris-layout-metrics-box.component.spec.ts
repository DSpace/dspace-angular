/* eslint-disable max-classes-per-file */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Observable, of } from 'rxjs';
import { RemoteData } from '../../../../../core/data/remote-data';
import { createSuccessfulRemoteDataObject } from '../../../../../shared/remote-data.utils';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../shared/mocks/translate-loader.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CrisLayoutLoaderDirective } from '../../../../directives/cris-layout-loader.directive';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { boxMetrics } from '../../../../../shared/testing/box.mock';
import { TextComponent } from '../metadata/rendering-types/text/text.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { CrisLayoutMetricsBoxComponent } from './cris-layout-metrics-box.component';
import { metricsComponent } from '../../../../../shared/testing/metrics-components.mock';
import { MetricsComponent } from '../../../../../core/layout/models/metrics-component.model';
import { MetricsComponentsService } from '../../../../../core/layout/metrics-components.service';
import { Metric } from '../../../../../core/shared/metric.model';
import { ItemDataService } from '../../../../../core/data/item-data.service';
import { CrisLayoutMetricRow } from '../../../../../core/layout/models/tab.model';
import SpyObj = jasmine.SpyObj;

export const metric1Mock = {
  acquisitionDate: new Date(),
  deltaPeriod1: null,
  deltaPeriod2: null,
  endDate: null,
  id: '1',
  last: true,
  metricCount: 333,
  metricType: 'views',
  rank: null,
  remark: null,
  startDate: null,
  type: null,
  _links: null
};

export const metric2Mock = { ...metric1Mock, metricType: 'downloads' };

const googleExample = '<a target="_blank" title="" \n' +
  'href="https://scholar.google.com/scholar?as_q=&amp;as_epq=A strong regioregularity effect in self-organizing conjugated polymer films and high-efficiency polythiophene: fullerene solar cells&amp;as_occt=any"\n' +
  ' >Check</a>';

const altMetricExample = '<div class=\'altmetric-embed\' data-badge-popover=\'bottom\' data-badge-type=\'donut\' data-doi="10.1038/nature.2012.9872"></div>';

const dimensionsExample = '<div class=\'__dimensions_badge_embed__\' data-doi="10.1038/nature.2012.9872"></div>';

export const metricGoogleScholarMock = { ...metric1Mock, metricType: 'googleScholar', remark: googleExample };

export const metricAltmetricMock = { ...metric1Mock, metricType: 'altmetric', remark: altMetricExample };

export const metricDimensionsMock = { ...metric1Mock, metricType: 'dimensions', remark: dimensionsExample };

export const metricEmbeddedView = { ...metric1Mock, metricType: 'embedded-view', remark: '' };
export const metricEmbeddedDownload = { ...metric1Mock, metricType: 'embedded-download', remark: '' };

export const metricRowsMock = [{
  metrics: [metric1Mock, metric2Mock]
}];

class MetricsComponentsDataServiceMock {
  findById(boxShortname: string): Observable<RemoteData<MetricsComponent>> {
    return of(
      createSuccessfulRemoteDataObject(metricsComponent)
    );
  }
  getMatchingMetrics(metrics: Metric[], maxColumn: number, metricTypes: string[]): CrisLayoutMetricRow[] {
    return metricRowsMock as any;
  }
}

let itemDataService: SpyObj<ItemDataService>;

describe('CrisLayoutMetricsBoxComponent', () => {
  let component: CrisLayoutMetricsBoxComponent;
  let fixture: ComponentFixture<CrisLayoutMetricsBoxComponent>;

  beforeEach(waitForAsync(() => {

    itemDataService = jasmine.createSpyObj('ItemDataService', {
      getMetrics: jasmine.createSpy('getMetrics')
    });

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
        { provide: MetricsComponentsService, useClass: MetricsComponentsDataServiceMock },
        { provide: ItemDataService, useValue: itemDataService },
        { provide: 'boxProvider', useClass: boxMetrics },
        { provide: 'itemProvider', useClass: { metrics: [metric1Mock, metric2Mock] } },
      ],
      declarations: [
        CrisLayoutMetricsBoxComponent,
        CrisLayoutLoaderDirective,
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

    itemDataService.getMetrics.and.returnValue(of(
      createSuccessfulRemoteDataObject({ pageInfo: {}, page: ['views'] } as any)
    ));
    fixture = TestBed.createComponent(CrisLayoutMetricsBoxComponent);
    component = fixture.componentInstance;
    component.item = {
      metrics: [metric1Mock, metric2Mock]
    } as any;

    component.box = boxMetrics;
    fixture.detectChanges();
  });

  xit('check metrics rows rendering', (done) => {
    const rowsFound = fixture.debugElement.queryAll(By.css('div[ds-metric-row]'));

    expect(rowsFound.length).toEqual(1);
    done();
  });
});
