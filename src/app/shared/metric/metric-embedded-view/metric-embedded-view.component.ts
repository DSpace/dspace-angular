import { Component, OnInit, Renderer2 } from '@angular/core';
import { BaseMetricComponent } from '../metric-loader/base-metric.component';

@Component({
  selector: 'ds-metric-embedded-view',
  templateUrl: './metric-embedded-view.component.html',
  styleUrls: ['./metric-embedded-view.component.scss', '../metric-loader/base-metric.component.scss']
})
export class MetricEmbeddedViewComponent extends BaseMetricComponent implements OnInit {

  href = '';

  constructor(private render: Renderer2) {
    super();
  }

  ngOnInit(): void {
    if (this.metric.remark) {
      const element: HTMLElement = this.render.createElement('div');
      element.innerHTML = this.metric.remark;
      const hrefAttr = (element.childNodes[0] as any).href;
      this.href = hrefAttr ? hrefAttr : '';
    }
  }
}
