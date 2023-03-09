import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Metric } from '../../../core/shared/metric.model';
import { hasNoValue } from '../../empty.util';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  template: ''
})
export abstract class BaseMetricComponent {

  @Input() metric: Metric;

  @Input() hideLabel = false;

  @Input() isListElement = false;

  @Output() hide: EventEmitter<boolean> = new EventEmitter();

  /**
   * A boolean representing if the metric content is hidden or not
   */
  isHidden$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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

  protected parseRemark() {
    return JSON.parse(this.metric.remark);
  }
}
