import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {BaseMetricComponent} from '../metric-loader/base-metric.component';

@Component({
  selector: 'ds-metric-embedded-download',
  templateUrl: './metric-embedded-download.component.html',
  styleUrls: ['./metric-embedded-download.component.scss']
})
export class MetricEmbeddedDownloadComponent extends BaseMetricComponent implements OnInit {
  sanitizedInnerHtml;
  constructor(protected sr: DomSanitizer) {
    super();
  }

  ngOnInit(): void {
    this.sanitizedInnerHtml = this.sr.bypassSecurityTrustHtml(this.metric.remark);
  }
}
