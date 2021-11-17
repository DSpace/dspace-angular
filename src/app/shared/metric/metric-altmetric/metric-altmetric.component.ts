import { Component, OnInit } from '@angular/core';
import { BaseEmbeddedMetricComponent } from '../metric-loader/base-embedded-metric.component';
import { DomSanitizer } from '@angular/platform-browser';

declare var _altmetric_embed_init: any;

@Component({
  selector: 'ds-metric-altmetric',
  templateUrl: './metric-altmetric.component.html',
  styleUrls: ['./metric-altmetric.component.scss']
})
export class MetricAltmetricComponent extends BaseEmbeddedMetricComponent implements OnInit {
  remark: JSON;
  constructor(protected sr: DomSanitizer) {
    super(sr);
  }
  ngOnInit() {
    this.remark = JSON.parse(this.metric.remark);
  }
  applyScript(): void {
    _altmetric_embed_init(this.metricChild.nativeElement);
  }

}
