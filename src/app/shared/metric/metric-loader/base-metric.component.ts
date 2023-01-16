import { Component, Input } from '@angular/core';
import { Metric } from '../../../core/shared/metric.model';
import { AppConfig } from '../../../../config/app-config.interface';
import { hasNoValue } from '../../empty.util';

@Component({
  template: ''
})
export abstract class BaseMetricComponent {

  @Input() metric: Metric;

  @Input() hideLabel = false;

  @Input() isListElement = false;

  readonly appConfig: AppConfig;

  /**
   * Get the detail url form metric remark if present.
   */
  getDetailUrl() {
    if (hasNoValue(this.metric.remark)) {
      return null;
    }
    try {
      const _remark = this.parseRemark();
      if (_remark.detailUrl) {
        return this.getBaseUrl(_remark.detailUrl);
      }
      if (_remark.link) {
        return this.getBaseUrl(_remark.link);
      }
    } catch (error) {
      /* */
    }
    return null;
  }

  protected parseRemark() {
    return JSON.parse(this.metric.remark);
  }

  protected getBaseUrl(metricHref: any = '') {
    return metricHref.replaceAll(this.appConfig.ui.baseUrl, '');
  }
}
