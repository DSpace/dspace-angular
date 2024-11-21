import {
  AsyncPipe,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  TitleCasePipe,
} from '@angular/common';
import {
  Component,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import {
  NativeWindowRef,
  NativeWindowService,
} from '../../../core/services/window.service';
import { hasValue } from '../../empty.util';
import { BaseMetricComponent } from '../metric-loader/base-metric.component';
import { MetricLoadScriptService } from '../metric-loader/metric-load-script.service';
import { ListMetricPropsPipe } from '../pipes/list-metric-props/list-metric-props.pipe';

@Component({
  selector: 'ds-metric-plumx',
  templateUrl: './metric-plumx.component.html',
  styleUrls: ['./metric-plumx.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgSwitch,
    NgSwitchCase,
    AsyncPipe,
    TitleCasePipe,
    TranslateModule,
    ListMetricPropsPipe,
  ],
})
export class MetricPlumxComponent extends BaseMetricComponent implements OnInit, OnDestroy {
  remark: JSON;

  private metricLoaderService: MetricLoadScriptService;

  private unlistenerEmpty: () => void;
  private unlistenerError: () => void;
  private unlistenerSuccess: () => void;

  constructor(
    @Inject(NativeWindowService) protected _window: NativeWindowRef,
    protected injector: Injector,
    private renderer2: Renderer2) {
    super();
  }

  async ngOnInit() {
    if (hasValue(this.metric.remark) && this.canLoadScript) {
      this.remark = this.parseRemark();
      const script = this.isListElement
        ? this.remark['list-src']
        : (this.remark as any).src;
      // script is dynamic base on entityType and is coming from backend
      this.metricLoaderService = this.injector.get(MetricLoadScriptService);
      await this.metricLoaderService.loadScript('plumX', script);
      // use the method to find and render all placeholders that haven't already been initialized
      this._window.nativeWindow.__plumX.widgets.init();

      if (!this.visibleWithoutData) {
        this.unlistenerEmpty = this.renderer2.listen(
          this._window.nativeWindow,
          'plum:widget-empty', event => {
            this.isHidden$.next(true);
            this.hide.emit(true);
          });
      }

      this.unlistenerError = this.renderer2.listen(
        this._window.nativeWindow,
        'plum:widget-error', event => {
          this.isHidden$.next(true);
          this.hide.emit(true);
        });
    }
  }

  ngOnDestroy() {
    if (this.unlistenerEmpty) {
      this.unlistenerEmpty();
    }
    if (this.unlistenerError) {
      this.unlistenerError();
    }
  }
}
