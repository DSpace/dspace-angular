import { Component, Input, OnInit } from '@angular/core';
import { Metric } from '../../../../../../core/shared/metric.model';
import { BaseEmbeddedMetricComponent } from '../metric-loader/base-embedded-metric.component';
import { DomSanitizer } from '@angular/platform-browser';

declare var _altmetric_embed_init: any;

@Component({
  selector: 'ds-metric-altmetric',
  templateUrl: './metric-altmetric.component.html',
  styleUrls: ['./metric-altmetric.component.scss']
})
export class MetricAltmetricComponent extends BaseEmbeddedMetricComponent {

  @Input() metric: Metric;

  constructor(protected sr: DomSanitizer) {
    super(sr);
  }

  scriptIsLoaded() {
    return _altmetric_embed_init;
  }

  applyScript(): void {
    _altmetric_embed_init(this.metricChild.nativeElement);
  }

}
