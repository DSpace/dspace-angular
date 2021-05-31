import { Component, OnInit } from '@angular/core';
import { BaseMetricComponent } from '../metric-loader/base-metric.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ds-metric-googlescholar',
  templateUrl: './metric-googlescholar.component.html',
  styleUrls: ['./metric-googlescholar.component.scss']
})
export class MetricGooglescholarComponent extends BaseMetricComponent implements OnInit {

  sanitizedInnerHtml;

  constructor(protected sr: DomSanitizer) {
    super();
  }

  ngOnInit() {
    this.sanitizedInnerHtml = this.sr.bypassSecurityTrustHtml(this.metric.remark);
  }

}
