import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Metric } from '../../../core/shared/metric.model';
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
}
