import { Component, OnInit } from '@angular/core';
import { BaseMetricComponent } from '../metric-loader/base-metric.component';
import { hasValue } from '../../empty.util';

@Component({
  selector: 'ds-metric-googlescholar',
  templateUrl: './metric-googlescholar.component.html',
  styleUrls: ['./metric-googlescholar.component.scss'],
})
export class MetricGooglescholarComponent extends BaseMetricComponent implements OnInit {

  url: string;

  constructor() {
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
