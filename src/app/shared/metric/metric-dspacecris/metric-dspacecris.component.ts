import { Component } from '@angular/core';
import { BaseMetricComponent } from '../metric-loader/base-metric.component';
import { hasNoValue } from '../../empty.util';

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
