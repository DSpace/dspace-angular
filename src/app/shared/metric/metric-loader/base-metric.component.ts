import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Metric } from '../../../core/shared/metric.model';

@Component({
  template: ''
})
export abstract class BaseMetricComponent {

  @Input() metric: Metric;

  @Input() hideLabel = false;

  @Input() isListElement = false;

  isVisible$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isVisible(): Observable<boolean> {
    return this.isVisible$;
  }
}
