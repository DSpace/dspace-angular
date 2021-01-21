import { Component, Input } from '@angular/core';
import { Metric } from '../../../../../../core/shared/metric.model';

@Component({
  template: '',
})
export abstract class BaseMetricComponent {

  @Input() metric: Metric;

}
