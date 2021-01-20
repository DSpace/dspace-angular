import { Component, Input } from '@angular/core';
import { MetricRow } from '../../metrics/cris-layout-metrics-box.component';
import { Metric } from '../../../../../core/shared/metric.model';

/**
 * This component renders the rows of metadata boxes
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: '[ds-metric-row]',
  templateUrl: './metric-row.component.html',
  styleUrls: ['./metric-row.component.scss']
})
export class MetricRowComponent {

  /**
   * Current row configuration
   */
  @Input() metricRow: MetricRow;

  getMetricClass(metric: Metric): string {
    if (metric) {
      return metric.metricType
    }
  }
}
