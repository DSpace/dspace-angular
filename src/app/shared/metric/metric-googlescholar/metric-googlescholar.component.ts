import { MetricVisualizationConfig } from './../../../../config/metric-visualization-config.interfaces';
import { Component, OnInit } from '@angular/core';
import { BaseMetricComponent } from '../metric-loader/base-metric.component';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'ds-metric-googlescholar',
  templateUrl: './metric-googlescholar.component.html',
  styleUrls: ['./metric-googlescholar.component.scss'],
})
export class MetricGooglescholarComponent extends BaseMetricComponent implements OnInit {
  remark: JSON;
  sanitizedInnerHtml;
  public style: MetricVisualizationConfig[] = environment.metricVisualizationConfig;

  constructor(protected sr: DomSanitizer) {
    super();
  }

  ngOnInit() {
    this.remark = JSON.parse(this.metric.remark);
    this.sanitizedInnerHtml = this.sr.bypassSecurityTrustHtml(this.metric.remark);
  }
}
