import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
  PLATFORM_ID,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ItemDataService } from '@dspace/core/data/item-data.service';
import { MetricsBoxConfiguration } from '@dspace/core/layout/models/box.model';
import { Item } from '@dspace/core/shared/item.model';
import { Metric } from '@dspace/core/shared/metric.model';
import { boxMetrics } from '@dspace/core/testing/box.mock';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import { createPaginatedList } from '@dspace/core/testing/utils.test';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { MetricRowComponent } from '../../../../../shared/metric/metric-row/metric-row.component';
import { MetricsComponentsService } from '../../../../../shared/metric/services/metrics-components.service';
import { DynamicLayoutMetricsBoxComponent } from './dynamic-layout-metrics-box.component';

const mockMetric1: Metric = Object.assign(new Metric(), {
  metricType: 'views',
  metricCount: 100,
});

const mockMetric2: Metric = Object.assign(new Metric(), {
  metricType: 'downloads',
  metricCount: 50,
});

const mockMetrics: Metric[] = [mockMetric1, mockMetric2];

const mockMatchingMetricRows = [
  { metrics: [mockMetric1] },
  { metrics: [mockMetric2] },
];

const mockItem: Item = Object.assign(new Item(), {
  uuid: 'test-item-uuid',
  metadata: [],
});

const mockMetricsBoxConfiguration: MetricsBoxConfiguration = {
  maxColumns: 2,
  metrics: ['views', 'downloads'],
  type: 'metric',
};

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
  _links: null,
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
  metrics: [metric1Mock, metric2Mock],
}];


describe('MetricsBoxComponent', () => {
  let comp: DynamicLayoutMetricsBoxComponent;
  let fixture: ComponentFixture<DynamicLayoutMetricsBoxComponent>;
  let itemDataService: jasmine.SpyObj<ItemDataService>;
  let metricsComponentsService: jasmine.SpyObj<MetricsComponentsService>;

  const setupTestBed = (platformId: string, configuration: MetricsBoxConfiguration = mockMetricsBoxConfiguration) => {
    itemDataService = jasmine.createSpyObj('ItemDataService', {
      getMetrics: createSuccessfulRemoteDataObject$(createPaginatedList(mockMetrics)),
    });

    metricsComponentsService = jasmine.createSpyObj('MetricsComponentsService', {
      getMatchingMetrics: mockMatchingMetricRows,
    });

    const boxProvider = { ...boxMetrics, configuration };

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        BrowserAnimationsModule,
        DynamicLayoutMetricsBoxComponent,
      ],
      providers: [
        { provide: ItemDataService, useValue: itemDataService },
        { provide: MetricsComponentsService, useValue: metricsComponentsService },
        { provide: PLATFORM_ID, useValue: platformId },
        { provide: 'boxProvider', useValue: boxProvider },
        { provide: 'itemProvider', useValue: { metrics: [metric1Mock, metric2Mock] } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(DynamicLayoutMetricsBoxComponent, {
      add: { changeDetection: ChangeDetectionStrategy.Default },
      remove: { imports: [MetricRowComponent] },
    }).compileComponents();
  };

  describe('when rendered in a browser', () => {
    beforeEach(waitForAsync(() => {
      setupTestBed('browser');
    }));

    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(DynamicLayoutMetricsBoxComponent);
      comp = fixture.componentInstance;
      comp.item = mockItem;
      comp.metricsBoxConfiguration = mockMetricsBoxConfiguration;
      fixture.detectChanges();
    }));

    it('should create', () => {
      expect(comp).toBeTruthy();
    });

    it('should call itemDataService.getMetrics with the item uuid', () => {
      expect(itemDataService.getMetrics).toHaveBeenCalledWith(mockItem.uuid);
    });

    it('should call metricsComponentsService.getMatchingMetrics with the correct arguments', () => {
      expect(metricsComponentsService.getMatchingMetrics).toHaveBeenCalledWith(
        mockMetrics,
        mockMetricsBoxConfiguration.maxColumns,
        mockMetricsBoxConfiguration.metrics,
      );
    });

    it('should populate metricRows with the result from getMatchingMetrics', () => {
      comp.metricRows.subscribe((rows) => {
        expect(rows).toEqual(mockMatchingMetricRows);
      });
    });

    it('should render a ds-metric-row for each metric row', () => {
      const metricRows = fixture.debugElement.queryAll(By.css('[ds-metric-row]'));
      expect(metricRows.length).toBe(mockMatchingMetricRows.length);
    });

    describe('ngOnDestroy', () => {
      it('should unsubscribe all subscriptions', () => {
        const sub = jasmine.createSpyObj('Subscription', ['unsubscribe']);
        comp.subs = [sub];
        comp.ngOnDestroy();
        expect(sub.unsubscribe).toHaveBeenCalled();
      });
    });
  });

  describe('when rendered on the server', () => {
    beforeEach(waitForAsync(() => {
      setupTestBed('server');
    }));

    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(DynamicLayoutMetricsBoxComponent);
      comp = fixture.componentInstance;
      comp.item = mockItem;
      comp.metricsBoxConfiguration = mockMetricsBoxConfiguration;
      fixture.detectChanges();
    }));

    it('should create', () => {
      expect(comp).toBeTruthy();
    });

    it('should NOT call itemDataService.getMetrics', () => {
      expect(itemDataService.getMetrics).not.toHaveBeenCalled();
    });

    it('should NOT call metricsComponentsService.getMatchingMetrics', () => {
      expect(metricsComponentsService.getMatchingMetrics).not.toHaveBeenCalled();
    });

    it('should leave metricRows empty', () => {
      comp.metricRows.subscribe((rows) => {
        expect(rows).toEqual([]);
      });
    });

    it('should not render any ds-metric-row', () => {
      const metricRows = fixture.debugElement.queryAll(By.css('[ds-metric-row]'));
      expect(metricRows.length).toBe(0);
    });
  });

  describe('when metricsBoxConfiguration has null maxColumns', () => {
    beforeEach(waitForAsync(() => {
      setupTestBed('browser', { maxColumns: null, metrics: ['views'] } as MetricsBoxConfiguration);
    }));

    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(DynamicLayoutMetricsBoxComponent);
      comp = fixture.componentInstance;
      comp.item = mockItem;
      fixture.detectChanges();
    }));

    it('should pass null maxColumns to getMatchingMetrics', () => {
      expect(metricsComponentsService.getMatchingMetrics).toHaveBeenCalledWith(
        mockMetrics,
        null,
        ['views'],
      );
    });
  });
});
