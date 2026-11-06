import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { LinkService } from '@dspace/core/cache/builders/link.service';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { Item } from '@dspace/core/shared/item.model';
import { Metric } from '@dspace/core/shared/metric.model';
import { getFirstSucceededRemoteListPayload } from '@dspace/core/shared/operators';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ds-metric-badges',
  templateUrl: './metric-badges.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
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
