import { Component, Input } from '@angular/core';
import { Metric } from '../../../../../core/shared/metric.model';

/**
 * This component renders the rows of metadata boxes
 */
@Component({
  selector: 'ds-metric',
  templateUrl: './metric.component.html',
  styleUrls: ['./metric.component.scss']
})
export class MetricComponent {

  /**
   * Current row configuration
   */
  @Input() metric: Metric;

  /**
   * Get the detail url form metric remark if present.
   */
  getDetailUrl() {
    const remark = this.metric.remark;
    return remark ? (remark as any).detailUrl : null;
  }
}
