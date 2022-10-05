import { Component, Input } from '@angular/core';
import { CrisLayoutMetricRow } from '../../../../../../core/layout/models/tab.model';

/**
 * This component renders the rows of metadata boxes
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[ds-metric-row]',
  templateUrl: './metric-row.component.html',
  styleUrls: ['./metric-row.component.scss'],
})
export class MetricRowComponent {
  /**
   * Current row configuration
   */
  @Input() metricRow: CrisLayoutMetricRow;
}
