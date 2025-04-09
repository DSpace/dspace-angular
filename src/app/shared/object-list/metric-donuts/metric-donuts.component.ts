import {
  AsyncPipe,
  isPlatformBrowser,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { LinkService } from '../../../core/cache/builders/link.service';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { Metric } from '../../../core/shared/metric.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { isEmpty } from '../../empty.util';
import { MetricLoaderComponent } from '../../metric/metric-loader/metric-loader.component';
import { followLink } from '../../utils/follow-link-config.model';

export const allowedDonuts = ['altmetric', 'dimensions', 'plumX'];

@Component({
  selector: 'ds-metric-donuts',
  templateUrl: './metric-donuts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MetricLoaderComponent,
    AsyncPipe,
  ],
})
/**
 * Component rendering the metric badges of a Dspace Object
 */
export class MetricDonutsComponent implements OnInit {

  /**
   * The item object for which to show the metrics donuts
   */
  @Input() item: Item;

  /**
   * The list of metric donuts to load
   */
  metrics$: BehaviorSubject<Metric[]> = new BehaviorSubject<Metric[]>([]);

  constructor(private linkService: LinkService, @Inject(PLATFORM_ID) protected platformId: any) {
  }

  ngOnInit() {
    this.linkService.resolveLink(this.item, followLink('metrics'));
    if (isPlatformBrowser(this.platformId)) {
      this.retrieveMetrics().subscribe((metrics: Metric[]) => {
        this.metrics$.next(metrics);
      });
    }
  }

  /**
   * Retrieve metrics from item object.
   */
  private retrieveMetrics(): Observable<Metric[]> {
    if (isEmpty(this.item.metrics)) {
      return of([]);
    } else {
      return this.item.metrics.pipe(
        getFirstCompletedRemoteData(),
        map((metricsRD: RemoteData<PaginatedList<Metric>>) => {
          if (metricsRD.hasSucceeded) {
            return metricsRD.payload.page.filter(metric => allowedDonuts.includes(metric.metricType));
          } else {
            return [];
          }
        }));
    }
  }

  identify(index, item) {
    return item.id;
  }

}
