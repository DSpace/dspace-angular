import {
  AsyncPipe,
  isPlatformBrowser,
} from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ItemDataService } from '@dspace/core/data/item-data.service';
import {
  DynamicLayoutBox,
  MetricsBoxConfiguration,
} from '@dspace/core/layout/models/box.model';
import { Item } from '@dspace/core/shared/item.model';
import { Metric } from '@dspace/core/shared/metric.model';
import { getFirstSucceededRemoteDataPayload } from '@dspace/core/shared/operators';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Subscription,
} from 'rxjs';

import { MetricRowComponent } from '../../../../../shared/metric/metric-row/metric-row.component';
import { MetricsComponentsService } from '../../../../../shared/metric/services/metrics-components.service';
import { renderDynamicLayoutBoxFor } from '../../../../decorators/dynamic-layout-box.decorator';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { DynamicLayoutBoxDirective } from '../../../../models/dynamic-layout-box-component.directive';

/**
 * List of metrics to be displayed
 */
export interface LayoutMetricRow {
  metrics: Metric[];
}


/**
 * This component renders the metrics boxes of items
 */
@renderDynamicLayoutBoxFor(LayoutBox.METRICS)
@Component({
  selector: 'ds-dynamic-layout-metrics-box',
  templateUrl: './dynamic-layout-metrics-box.component.html',
  imports: [
    AsyncPipe,
    MetricRowComponent,
  ],
})
export class DynamicLayoutMetricsBoxComponent extends DynamicLayoutBoxDirective implements OnInit, OnDestroy {
  /**
   * Computed metric rows for the item and the current box
   */
  metricRows: BehaviorSubject<LayoutMetricRow[]> = new BehaviorSubject<LayoutMetricRow[]>([]);

  /**
   * true if the item has a thumbnail, false otherwise
   */
  hasThumbnail = false;

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  /**
   * Contains the metrics configuration for current box
   */
  @Input() metricsBoxConfiguration: MetricsBoxConfiguration;

  constructor(
    protected metricsComponentService: MetricsComponentsService,
    protected itemService: ItemDataService,
    protected translateService: TranslateService,
    @Inject(PLATFORM_ID) protected platformId: any,
    @Inject('boxProvider') public boxProvider: DynamicLayoutBox,
    @Inject('itemProvider') public itemProvider: Item,
  ) {
    super(translateService, boxProvider, itemProvider);
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.metricsBoxConfiguration = this.box.configuration as MetricsBoxConfiguration;
      this.subs.push(
        this.itemService.getMetrics(this.item.uuid).pipe(
          getFirstSucceededRemoteDataPayload(),
        ).subscribe((result) => {
          const matchingMetrics = this.metricsComponentService.getMatchingMetrics(
            result.page,
            this.metricsBoxConfiguration.maxColumns,
            this.metricsBoxConfiguration.metrics,
          );
          this.metricRows.next(matchingMetrics);
        },
        ),
      );
    }
  }

  /**
   * Unsubscribes all subscriptions
   */
  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
