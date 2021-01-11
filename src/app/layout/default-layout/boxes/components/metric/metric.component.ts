import { Component, Input, OnInit } from '@angular/core';
import { Metric } from '../../../../../core/shared/metric.model';
import { MetricDynamicScriptLoaderService } from './metric-dynamic-script-loader.service';
import { DomSanitizer } from '@angular/platform-browser';

export enum MetricTypeEnum {
  DSPACECRIS = 'DSPACECRIS',
  EMBEDDED = 'EMBEDDED'
}

/**
 * This component renders the rows of metadata boxes
 */
@Component({
  selector: 'ds-metric',
  templateUrl: './metric.component.html',
  styleUrls: ['./metric.component.scss']
})
export class MetricComponent implements OnInit {

  metricEnumValues = MetricTypeEnum;

  /**
   * Current row configuration
   */
  @Input() metric: Metric;

  metricTypeEnum: MetricTypeEnum;

  sanitizedInnerHtml;

  constructor(private metricScriptLoaderService: MetricDynamicScriptLoaderService,
              private sr: DomSanitizer) {}

  ngOnInit() {
    if (this.metric) {
      this.setMetricTypeEnum();
      if (this.metricTypeEnum === MetricTypeEnum.EMBEDDED) {
        this.sanitizedInnerHtml = this.sr.bypassSecurityTrustHtml(this.metric.remark);
        this.metricScriptLoaderService.loadMetricScript(this.metric.metricType).then(() => {
          console.log('Completing initialization of', this.metric.metricType)
        })
      }
    }
  }

  /**
   * Get the detail url form metric remark if present.
   */
  getDetailUrl() {
    const remark = this.metric.remark;
    return remark ? (remark as any).detailUrl : null;
  }

  /**
   * Set the metricTypeEnum based on the provided metric.id.
   */
  setMetricTypeEnum() {
    if ((this.metric.id + '').includes('/')) {
      this.metricTypeEnum = MetricTypeEnum.EMBEDDED;
    } else {
      this.metricTypeEnum = MetricTypeEnum.DSPACECRIS;
    }
  }
}
