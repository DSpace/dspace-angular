import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { CrisLayoutBoxModelComponent } from '../../../../models/cris-layout-box-component.model';
import { RenderCrisLayoutBoxFor } from '../../../../decorators/cris-layout-box.decorator';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { getFirstSucceededRemoteDataPayload } from '../../../../../core/shared/operators';
import { hasValue } from '../../../../../shared/empty.util';
import { MetricsComponentsService } from '../../../../../core/layout/metrics-components.service';
import { ItemDataService } from '../../../../../core/data/item-data.service';
import { CrisLayoutBox, MetricsBoxConfiguration, } from '../../../../../core/layout/models/box.model';
import { Item } from '../../../../../core/shared/item.model';
import { CrisLayoutMetricRow } from '../../../../../core/layout/models/tab.model';
import { isPlatformBrowser } from '@angular/common';

/**
 * This component renders the metadata boxes of items
 */
@Component({
  selector: 'ds-cris-layout-metrics-box',
  templateUrl: './cris-layout-metrics-box.component.html',
  styleUrls: ['./cris-layout-metrics-box.component.scss']
})
/**
 * For overwrite this component create a new one that extends CrisLayoutBoxObj and
 * add the CrisLayoutBoxModelComponent decorator indicating the type of box to overwrite
 */
@RenderCrisLayoutBoxFor(LayoutBox.METRICS, true)
export class CrisLayoutMetricsBoxComponent extends CrisLayoutBoxModelComponent implements OnInit, OnDestroy {

  /**
   * Contains the metrics configuration for current box
   */
  metricsBoxConfiguration: MetricsBoxConfiguration;

  /**
   * Computed metric rows for the item and the current box
   */
  metricRows: BehaviorSubject<CrisLayoutMetricRow[]> = new BehaviorSubject<CrisLayoutMetricRow[]>([]);

  /**
   * true if the item has a thumbnail, false otherwise
   */
  hasThumbnail = false;

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  constructor(
    protected metricsComponentService: MetricsComponentsService,
    protected itemService: ItemDataService,
    protected translateService: TranslateService,
    @Inject('boxProvider') public boxProvider: CrisLayoutBox,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {
    super(translateService, boxProvider, itemProvider);
  }

  ngOnInit() {
    super.ngOnInit();

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
