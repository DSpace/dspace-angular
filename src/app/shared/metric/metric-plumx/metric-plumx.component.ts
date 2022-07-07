import { Component, Inject, Injector, OnInit } from '@angular/core';
import { BaseMetricComponent } from '../metric-loader/base-metric.component';
import { hasValue } from '../../empty.util';
import { MetricLoadScriptService } from '../metric-loader/metric-load-script.service';
import { NativeWindowRef, NativeWindowService } from '../../../core/services/window.service';

@Component({
  selector: 'ds-metric-plumx',
  templateUrl: './metric-plumx.component.html',
  styleUrls: ['./metric-plumx.component.scss'],
})
export class MetricPlumxComponent extends BaseMetricComponent implements OnInit {
  remark: JSON;
  private metricLoaderService: MetricLoadScriptService;

  constructor(
    @Inject(NativeWindowService) protected _window: NativeWindowRef,
    protected injector: Injector) {
    super();
  }

  async ngOnInit() {
    if (hasValue(this.metric.remark)) {
      this.remark = JSON.parse(this.metric.remark);
      const script = this.isListElement
        ? this.remark['list-src']
        : (this.remark as any).src;
      // script is dynamic base on entityType and is coming from backend
      this.metricLoaderService = this.injector.get(MetricLoadScriptService);
      await this.metricLoaderService.loadScript('plumX', script);
      // use the method to find and render all placeholders that haven't already been initialized
      this._window.nativeWindow.__plumX.widgets.init();
    }
  }
}
