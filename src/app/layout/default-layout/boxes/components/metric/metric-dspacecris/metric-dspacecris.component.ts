import { Component } from '@angular/core';
import { BaseMetricComponent } from '../metric-loader/base-metric.component';

@Component({
  selector: 'ds-metric-dspacecris',
  templateUrl: './metric-dspacecris.component.html',
  styleUrls: ['./metric-dspacecris.component.scss']
})
export class MetricDspacecrisComponent extends BaseMetricComponent {

  constructor() {
    super();
  }

  /**
   * Get the detail url form metric remark if present.
   */
  getDetailUrl() {
    const remark = this.metric.remark;
    return remark ? (remark as any).detailUrl : null;
  }

}
