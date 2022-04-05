import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Metric } from '../../../core/shared/metric.model';
import { hasValue } from '../../empty.util';
import { getFirstSucceededRemoteListPayload } from '../../../core/shared/operators';
import { map } from 'rxjs/operators';
import { Item } from '../../../core/shared/item.model';
import { LinkService } from '../../../core/cache/builders/link.service';
import { followLink } from '../../utils/follow-link-config.model';

export const allowedDonuts = ['altmetric', 'dimensions', 'plumX'];

@Component({
  selector: 'ds-metric-donuts',
  templateUrl: './metric-donuts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
/**
 * Component rendering the metric badges of a Dspace Object
 */
export class MetricDonutsComponent implements OnInit {

  @Input() item: Item;

  constructor(private linkService: LinkService) {
  }

  ngOnInit() {
    this.linkService.resolveLink(this.item, followLink('metrics'));
  }

  /**
   * Filter metrics with a positive metricCount value.
   */
  donuts(): Observable<Metric[]> {
    if (!hasValue(this.item.metrics)) {
      return of([]);
    }
    return this.item.metrics.pipe(
      getFirstSucceededRemoteListPayload(),
      map((metrics: Metric[]) => {
        return metrics.filter(metric => allowedDonuts.includes(metric.metricType));
      }));
  }

  identify(index, item) {
    return item.id;
  }

}
