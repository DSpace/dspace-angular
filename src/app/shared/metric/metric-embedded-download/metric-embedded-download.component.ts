import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { BaseMetricComponent } from '../metric-loader/base-metric.component';
import { APP_CONFIG, AppConfig } from '../../../../config/app-config.interface';
import { hasValue } from '../../empty.util';

@Component({
  selector: 'ds-metric-embedded-download',
  templateUrl: './metric-embedded-download.component.html',
  styleUrls: ['./metric-embedded-download.component.scss', '../metric-loader/base-metric.component.scss']
})
export class MetricEmbeddedDownloadComponent extends BaseMetricComponent implements OnInit {
  href = '';

  constructor(
    @Inject(APP_CONFIG) readonly appConfig: AppConfig,
    private render: Renderer2
  ) {
    super();
  }

  ngOnInit(): void {
    if (hasValue(this.metric.remark)) {
      this.href = this.getDetailUrl();
      const element: HTMLElement = this.render.createElement('div');
      element.innerHTML = this.metric.remark;
    }
  }

  getDetailUrl(): null | any {
    try {
      return this.parseRemark()?.href;
    } catch (e) {
      /* */
    }
  }
}
