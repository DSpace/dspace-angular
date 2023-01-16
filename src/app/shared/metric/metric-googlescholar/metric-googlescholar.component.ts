import { Component, Inject, OnInit } from '@angular/core';
import { BaseMetricComponent } from '../metric-loader/base-metric.component';
import { APP_CONFIG, AppConfig } from '../../../../config/app-config.interface';
import { hasValue } from '../../empty.util';

@Component({
  selector: 'ds-metric-googlescholar',
  templateUrl: './metric-googlescholar.component.html',
  styleUrls: ['./metric-googlescholar.component.scss'],
})
export class MetricGooglescholarComponent extends BaseMetricComponent implements OnInit {

  url: string;

  constructor(@Inject(APP_CONFIG) readonly appConfig: AppConfig) {
    super();
  }

  ngOnInit() {
    this.url = this.getDetailUrl();
  }

  getDetailUrl(): null | any {
    try {
      const remark = this.parseRemark();
      if (hasValue(remark)) {
        return remark.href;
      }
    } catch (e) {
      /* */
    }
  }
}
