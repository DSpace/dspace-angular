import { Component } from '@angular/core';
import { BaseEmbeddedMetricComponent } from '../metric-loader/base-embedded-metric.component';
import { DomSanitizer } from '@angular/platform-browser';

declare var __dimensions_embed: any;

@Component({
  selector: 'ds-metric-dimensions',
  templateUrl: './metric-dimensions.component.html',
  styleUrls: ['./metric-dimensions.component.scss']
})
export class MetricDimensionsComponent extends BaseEmbeddedMetricComponent {

  constructor(protected sr: DomSanitizer) {
    super(sr);
  }

  applyScript(): void {
    __dimensions_embed.addBadges();
  }

}
