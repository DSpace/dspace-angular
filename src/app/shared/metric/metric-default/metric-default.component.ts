import { Component } from '@angular/core';
import { BaseMetricComponent } from '../metric-loader/base-metric.component';
import { hasNoValue } from '../../empty.util';

@Component({
  selector: 'ds-metric-default',
  templateUrl: './metric-default.component.html',
  styleUrls: ['./metric-default.component.scss', '../metric-loader/base-metric.component.scss'],
})
export class MetricDefaultComponent extends BaseMetricComponent {
  constructor() {
    super();
  }

  /**
   * Get the detail url form metric remark if present.
   */
  getDetailUrl() {
    if (hasNoValue(this.metric.remark)) {
      return null;
    }
    try {
      const _remark = JSON.parse(this.metric.remark);
      if (_remark.detailUrl) {
        return _remark.detailUrl;
      }
      if (_remark.link) {
        return _remark.link;
      }
    } catch (error) {
      /* */
    }
    return null;
  }
}
