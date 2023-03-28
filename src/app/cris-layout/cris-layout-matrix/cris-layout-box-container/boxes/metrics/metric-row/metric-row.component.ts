import { Component, Input } from '@angular/core';

import { BehaviorSubject, Observable, of } from 'rxjs';

import { CrisLayoutMetricRow } from '../../../../../../core/layout/models/tab.model';

/**
 * This component renders the rows of metadata boxes
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[ds-metric-row]',
  templateUrl: './metric-row.component.html',
  styleUrls: ['./metric-row.component.scss'],
})
export class MetricRowComponent {
  /**
   * Current row configuration
   */
  @Input() metricRow: CrisLayoutMetricRow;

  private isVisible$: BehaviorSubject<Map<string, boolean>> = new BehaviorSubject(new Map());

  toggleVisibility(metricId, event) {
    const newMap: Map<string, boolean> = this.isVisible$.value;
    newMap.set(metricId, event);
    this.isVisible$.next(newMap);
  }

  isHidden(metricId): Observable<boolean> {
    if (this.isVisible$.value.has(metricId)) {
      return of(this.isVisible$.value.get(metricId));
    } else {
      return of(false);
    }
  }
}
