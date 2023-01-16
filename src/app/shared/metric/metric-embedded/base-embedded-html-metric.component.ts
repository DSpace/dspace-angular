import { BaseMetricComponent } from '../metric-loader/base-metric.component';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { hasValue } from '../../empty.util';

@Component({
  template: ''
})
export abstract class BaseEmbeddedHtmlMetricComponent extends BaseMetricComponent implements OnInit {

  href = '';

  protected constructor(protected render: Renderer2) {
    super();
  }

  ngOnInit(): void {
    if (hasValue(this.metric.remark)) {
      this.href = this.getDetailUrl();
    }
  }

  getDetailUrl(): null | any {
    return (this.parseRemark()?.childNodes[0] as any)?.href || '';
  }

  protected parseRemark(): HTMLElement {
    const element: HTMLElement = this.render.createElement('div');
    element.innerHTML = this.metric?.remark;
    return element;
  }
}
