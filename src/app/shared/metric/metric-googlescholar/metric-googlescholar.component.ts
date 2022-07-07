import { Component, OnInit } from '@angular/core';
import { BaseMetricComponent } from '../metric-loader/base-metric.component';

@Component({
  selector: 'ds-metric-googlescholar',
  templateUrl: './metric-googlescholar.component.html',
  styleUrls: ['./metric-googlescholar.component.scss'],
})
export class MetricGooglescholarComponent extends BaseMetricComponent implements OnInit {
  remark: JSON;

  constructor() {
    super();
  }

  ngOnInit() {
    this.remark = JSON.parse(this.metric.remark);
  }
}
