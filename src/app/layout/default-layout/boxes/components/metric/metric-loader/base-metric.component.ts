import { Input } from '@angular/core';
import { Metric } from '../../../../../../core/shared/metric.model';

export abstract class BaseMetricComponent {

  @Input() metric: Metric;

}
