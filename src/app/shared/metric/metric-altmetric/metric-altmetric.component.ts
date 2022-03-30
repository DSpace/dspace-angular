import { Component, OnInit } from '@angular/core';
import { BaseEmbeddedMetricComponent } from '../metric-loader/base-embedded-metric.component';
import { DomSanitizer } from '@angular/platform-browser';
import { hasValue } from '../../empty.util';

declare var _altmetric_embed_init: any;

@Component({
  selector: 'ds-metric-altmetric',
  templateUrl: './metric-altmetric.component.html',
  styleUrls: ['./metric-altmetric.component.scss', '../metric-loader/base-metric.component.scss']
})
export class MetricAltmetricComponent extends BaseEmbeddedMetricComponent implements OnInit {
  remark: JSON;
  constructor(protected sr: DomSanitizer) {
    super(sr);
  }

  ngOnInit() {
    if (hasValue(this.metric.remark)) {
        this.remark = JSON.parse(this.metric.remark);
    }
  }

  applyScript(): void {
    _altmetric_embed_init(this.metricChild.nativeElement);
  }

}
