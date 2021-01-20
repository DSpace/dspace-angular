import { Component, Input } from '@angular/core';
import { Metric } from '../../../../../../core/shared/metric.model';
import { BaseEmbeddedMetricComponent } from '../metric-loader/base-embedded-metric.component';
import { DomSanitizer } from '@angular/platform-browser';

declare var __dimensions_embed: any;

@Component({
  selector: 'ds-metric-dimensions',
  templateUrl: './metric-dimensions.component.html',
  styleUrls: ['./metric-dimensions.component.scss']
})
export class MetricDimensionsComponent extends BaseEmbeddedMetricComponent {

  @Input() metric: Metric;

  constructor(protected sr: DomSanitizer) {
    super(sr);
  }

  scriptIsLoaded() {
    return __dimensions_embed;
  }

  applyScript(): void {
    __dimensions_embed.addBadges();
  }

}
