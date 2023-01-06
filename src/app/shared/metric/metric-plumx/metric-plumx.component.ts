import { ChangeDetectorRef, Component, Inject, Injector, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BaseMetricComponent } from '../metric-loader/base-metric.component';
import { hasValue } from '../../empty.util';
import { MetricLoadScriptService } from '../metric-loader/metric-load-script.service';
import { NativeWindowRef, NativeWindowService } from '../../../core/services/window.service';

@Component({
  selector: 'ds-metric-plumx',
  templateUrl: './metric-plumx.component.html',
  styleUrls: ['./metric-plumx.component.scss'],
})
export class MetricPlumxComponent extends BaseMetricComponent implements OnInit, OnDestroy {
  remark: JSON;

  private metricLoaderService: MetricLoadScriptService;
  /**
   * boolean used to check if the #metricChild child is hidden or not
   */
  isPlumxHidden = false;

  private unlistenerEmpty: () => void;
  private unlistenerError: () => void;
  private unlistenerSuccess: () => void;
  constructor(
    @Inject(NativeWindowService) protected _window: NativeWindowRef,
    protected injector: Injector,
    private renderer2: Renderer2, private cdr: ChangeDetectorRef) {
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
      
      this.unlistenerSuccess = this.renderer2.listen(
        this._window.nativeWindow, 
        "plum:widget-load", event => {
          this.isPlumxHidden = false;
          this.isVisible$.next(true);
          this.cdr.detectChanges();
        });
      this.unlistenerEmpty = this.renderer2.listen(
        this._window.nativeWindow, 
        "plum:widget-empty", event => {
          this.isPlumxHidden = true;
          this.isVisible$.next(false);
          this.cdr.detectChanges();
        });
      this.unlistenerError = this.renderer2.listen(
        this._window.nativeWindow, 
        "plum:widget-error", event => {
          this.isPlumxHidden = true;
          this.isVisible$.next(false);
          this.cdr.detectChanges();
        });  
    }
  }
  
  ngOnDestroy() {
    this.unlistenerEmpty();
    this.unlistenerError();
  }
}
