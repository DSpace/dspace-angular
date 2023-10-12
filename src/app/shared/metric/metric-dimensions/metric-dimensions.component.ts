import { ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { BaseEmbeddedMetricComponent } from '../metric-loader/base-embedded-metric.component';
import { DomSanitizer } from '@angular/platform-browser';
import { hasValue } from '../../empty.util';

declare let __dimensions_embed: any;

@Component({
  selector: 'ds-metric-dimensions',
  templateUrl: './metric-dimensions.component.html',
  styleUrls: ['./metric-dimensions.component.scss', '../metric-loader/base-metric.component.scss']
})
export class MetricDimensionsComponent extends BaseEmbeddedMetricComponent implements OnInit, OnDestroy {
  remark: JSON;

  private unlistener: () => void;

  constructor(private renderer2: Renderer2, private cdr: ChangeDetectorRef, protected sr: DomSanitizer) {
    super(sr);
  }

  ngOnInit() {
    if (hasValue(this.metric.remark)) {
      this.remark = this.parseRemark();
    }
  }

  applyScript(): void {
    __dimensions_embed.addBadges();
    this.unlistener = this.renderer2.listen(this.metricChild?.nativeElement, 'dimensions_embed:hide', () => {
      this.isHidden$.next(true);
      this.hide.emit(true);
    });

  }

  ngOnDestroy() {
    if (this.unlistener) {
      this.unlistener();
    }
  }
}
