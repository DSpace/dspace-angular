import {
  AsyncPipe,
  NgFor,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { LinkService } from '../../../core/cache/builders/link.service';
import { Item } from '../../../core/shared/item.model';
import { Metric } from '../../../core/shared/metric.model';
import { getFirstSucceededRemoteListPayload } from '../../../core/shared/operators';
import { hasValue } from '../../empty.util';
import { followLink } from '../../utils/follow-link-config.model';

@Component({
  selector: 'ds-metric-badges',
  templateUrl: './metric-badges.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgFor,
    AsyncPipe,
    TranslateModule,
  ],
})
/**
 * Component rendering the metric badges of a Dspace Object
 */
export class MetricBadgesComponent implements OnInit {

  @Input() item: Item;

  metrics$: Observable<Metric[]>;

  constructor(private linkService: LinkService) {
  }

  ngOnInit() {
    this.linkService.resolveLink(this.item, followLink('metrics'));
    this.metrics$ = this.metrics();
  }

  /**
   * Filter metrics with a positive metricCount value.
   */
  metrics(): Observable<Metric[]> {
    if (!hasValue(this.item.metrics)) {
      return of([]);
    }
    return this.item.metrics.pipe(
      getFirstSucceededRemoteListPayload(),
      map((metrics: Metric[]) => {
        return metrics.filter(metric => metric.metricCount && metric.metricCount > 0);
      }));
  }

}
