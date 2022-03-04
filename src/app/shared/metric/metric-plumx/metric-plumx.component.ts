import { Component, Injector, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BaseMetricComponent } from '../metric-loader/base-metric.component';
import { MetricLoaderService } from '../metric-loader/metric-loader.service';
import { hasValue } from '../../empty.util';
@Component({
  selector: 'ds-metric-plumx',
  templateUrl: './metric-plumx.component.html',
  styleUrls: ['./metric-plumx.component.scss'],
})
export class MetricPlumxComponent
  extends BaseMetricComponent
  implements OnInit
{
  remark: JSON;
  private metricLoaderService: MetricLoaderService;

  constructor(protected sr: DomSanitizer, protected injector: Injector) {
    super();
  }

  async ngOnInit() {
    if (hasValue(this.metric.remark)) {
      this.remark = JSON.parse(this.metric.remark);
      const script = this.isListElement
        ? this.remark['list-src']
        : (this.remark as any).src;
      // script is dynamic base on entityTyp and is coming from backend
      this.metricLoaderService = this.injector.get(MetricLoaderService);
      await this.metricLoaderService.setScript('plumX', script);
      // use the method to find and render all placeholders that haven't already been initialized
      window['__plumX'].widgets.init();
    }
  }
}
