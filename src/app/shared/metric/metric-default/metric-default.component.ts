import { Component, OnInit } from '@angular/core';
import { BaseMetricComponent } from '../metric-loader/base-metric.component';
import { METRIC_TYPE_DOWNLOAD } from '../metric-embedded/metric-embedded-download/metric-embedded-download.component';

@Component({
  selector: 'ds-metric-default',
  templateUrl: './metric-default.component.html',
  styleUrls: ['./metric-default.component.scss', '../metric-loader/base-metric.component.scss'],
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
