import {
  AsyncPipe,
  NgIf,
  TitleCasePipe,
} from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
  Renderer2,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { hasValue } from '../../empty.util';
import { BaseEmbeddedMetricComponent } from '../metric-loader/base-embedded-metric.component';
import { ListMetricPropsPipe } from '../pipes/list-metric-props/list-metric-props.pipe';

declare let _altmetric_embed_init: any;

@Component({
  selector: 'ds-metric-altmetric',
  templateUrl: './metric-altmetric.component.html',
  styleUrls: ['./metric-altmetric.component.scss', '../metric-loader/base-metric.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    TitleCasePipe,
    TranslateModule,
    ListMetricPropsPipe,
  ],
})
export class MetricAltmetricComponent extends BaseEmbeddedMetricComponent implements OnInit, AfterViewChecked, AfterViewInit {
  remark: JSON;
  /**
   * Flag to show the altmetric label
   */
  showAltmetricLabel$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(protected sr: DomSanitizer, private renderer: Renderer2) {
    super(sr);
  }

  ngOnInit() {
    if (hasValue(this.metric.remark)) {
      this.remark = this.parseRemark();
    }
  }

  applyScript(): void {
    _altmetric_embed_init(this.metricChild.nativeElement);
  }

  ngAfterViewChecked(): void {
    if (this.metricChild?.nativeElement?.children[0].classList.contains('altmetric-hidden')) {
      this.isHidden$.next(true);
      this.hide.emit(true);
    }
  }

  ngAfterViewInit(): void {
    if (hasValue(this.metricChild?.nativeElement)) {
      // Show the altmetric label only when the altmetric component is ready
      this.renderer.listen(this.metricChild.nativeElement, 'altmetric:show', () => {
        this.showAltmetricLabel$.next(true);
      });
    }
  }
}
