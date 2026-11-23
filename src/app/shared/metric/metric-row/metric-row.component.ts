import {
  Component,
  Input,
} from '@angular/core';
import { Metric } from '@dspace/core/shared/metric.model';
import { BehaviorSubject } from 'rxjs';

import { MetricLoaderComponent } from '../metric-loader/metric-loader.component';

/**
 * Configuration for metric row layout
 */
export interface LayoutMetricRow {
  metrics: Metric[];
}

/**
 * This component renders the rows of metadata boxes
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[ds-metric-row]',
  templateUrl: './metric-row.component.html',
  styleUrls: ['./metric-row.component.scss'],
  imports: [
    MetricLoaderComponent,
  ],
})
export class MetricRowComponent {
  /**
   * Current row configuration
   */
  @Input() metricRow: LayoutMetricRow;

  private isVisible$: BehaviorSubject<Map<string, boolean>> = new BehaviorSubject(new Map());

  toggleVisibility(metricId: string, event) {
    const newMap: Map<string, boolean> = this.isVisible$.value;
    newMap.set(metricId, event);
    this.isVisible$.next(newMap);
  }

  isHidden(metricId: string): boolean {
    if (this.isVisible$.value.has(metricId)) {
      return this.isVisible$.value.get(metricId);
    } else {
      return false;
    }
  }
}
