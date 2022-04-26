import { Component, OnInit } from '@angular/core';
import { BaseEmbeddedMetricComponent } from '../metric-loader/base-embedded-metric.component';
import { DomSanitizer } from '@angular/platform-browser';
import { hasValue } from '../../empty.util';

declare var __dimensions_embed: any;

@Component({
  selector: 'ds-metric-dimensions',
  templateUrl: './metric-dimensions.component.html',
  styleUrls: ['./metric-dimensions.component.scss', '../metric-loader/base-metric.component.scss']
})
export class MetricDimensionsComponent extends BaseEmbeddedMetricComponent implements OnInit {
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
    __dimensions_embed.addBadges();
  }
}
