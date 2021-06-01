import { Component, OnInit } from '@angular/core';
import {BaseMetricComponent} from '../metric-loader/base-metric.component';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'ds-metric-embedded-view',
  templateUrl: './metric-embedded-view.component.html',
  styleUrls: ['./metric-embedded-view.component.scss']
})
export class MetricEmbeddedViewComponent  extends BaseMetricComponent implements OnInit  {
  sanitizedInnerHtml;
  constructor(protected sr: DomSanitizer) {
    super();
  }

  ngOnInit(): void {
    this.sanitizedInnerHtml = this.sr.bypassSecurityTrustHtml(this.metric.remark);
  }

}
