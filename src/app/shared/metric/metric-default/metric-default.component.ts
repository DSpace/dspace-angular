import {
  DatePipe,
  NgClass,
  NgIf,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { RedirectWithHrefDirective } from '../../../directives/redirect/redirect-href.directive';
import { METRIC_TYPE_DOWNLOAD } from '../metric-embedded/metric-embedded-download/metric-embedded-download.component';
import { BaseMetricComponent } from '../metric-loader/base-metric.component';

@Component({
  selector: 'ds-metric-default',
  templateUrl: './metric-default.component.html',
  styleUrls: ['./metric-default.component.scss', '../metric-loader/base-metric.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgbTooltipModule,
    RedirectWithHrefDirective,
    DatePipe,
    TranslateModule,
  ],
})
export class MetricDefaultComponent extends BaseMetricComponent implements OnInit {

  url: string;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.url = this.getDetailUrl();
    if (this.metric.metricType === 'download') {
      this.url += (this.url.includes('?') ? '&' : '?') + 'reportType=' + METRIC_TYPE_DOWNLOAD;
    }
  }
}
