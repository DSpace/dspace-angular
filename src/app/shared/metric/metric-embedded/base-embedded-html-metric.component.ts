import { BaseMetricComponent } from '../metric-loader/base-metric.component';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { hasValue } from '../../empty.util';
import { LOCAL_PROTOCOL } from '../../../redirect/redirect.service';

@Component({
  template: ''
})
export abstract class BaseEmbeddedHtmlMetricComponent extends BaseMetricComponent implements OnInit {

  readonly REGEX_FIRST_SLASH = /(^\w*:)(\/{2})([^\/].*[^\/]\/{1})/;

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
    const href = ((this.parseRemark()?.childNodes[0] as any)?.href || '');
    let protocolEnd: number = href.indexOf('//');
    let noProtocol = null;
    let strippedHref = null;
    if (protocolEnd > 0) {
      // href - http://{host}?:{port}/statistics/item/{uuid}
      noProtocol = href.substring(protocolEnd + 2);
      // noProtocol - {host}?:{port}/statistics/item/{uuid}
      strippedHref = noProtocol.substring(noProtocol.indexOf('/') + 1);
      // strippedHred - statistics/item/{uuid}
    } else {
      // noProtocol - /statistics/item/{uuid} or statistics/item/{uuid}
      noProtocol = href;
      if (noProtocol.startsWith('/')) {
        // href - /statistics/item/{uuid}
        strippedHref = noProtocol.substring(1);
      }
    }
    return LOCAL_PROTOCOL + strippedHref;
  }

  protected parseRemark(): HTMLElement {
    const element: HTMLElement = this.render.createElement('div');
    element.innerHTML = this.metric?.remark;
    return element;
  }
}
