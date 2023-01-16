import { Component, Inject, OnInit } from '@angular/core';
import { BaseMetricComponent } from '../metric-loader/base-metric.component';
import { APP_CONFIG, AppConfig } from '../../../../config/app-config.interface';

@Component({
  selector: 'ds-metric-default',
  templateUrl: './metric-default.component.html',
  styleUrls: ['./metric-default.component.scss', '../metric-loader/base-metric.component.scss'],
})
export class MetricDefaultComponent extends BaseMetricComponent implements OnInit {

  url: string;

  constructor(@Inject(APP_CONFIG) readonly appConfig: AppConfig) {
    super();
  }

  ngOnInit(): void {
    this.url = this.getDetailUrl();
  }
}
