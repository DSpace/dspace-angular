import { Component, OnInit } from '@angular/core';
import { BaseEmbeddedMetricComponent } from '../metric-loader/base-embedded-metric.component';
import { DomSanitizer } from '@angular/platform-browser';
import { hasValue } from '../../empty.util';

declare let _altmetric_embed_init: any;

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
        this.remark = this.parseRemark();
    }
  }

  applyScript(): void {
    _altmetric_embed_init(this.metricChild.nativeElement);
  }

  ngAfterViewChecked(): void {
    if (this.metricChild?.nativeElement?.children[0].classList.contains('altmetric-hidden')) {
      this.isHidden$.next(true);
      this.hide.emit(true);
    }
  }
}
