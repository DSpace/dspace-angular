import {Component, Injector, OnInit} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {BaseMetricComponent} from '../metric-loader/base-metric.component';
import {MetricLoaderService} from '../metric-loader/metric-loader.service';
import {hasValue} from '../../empty.util';

@Component({
  selector: 'ds-metric-plumx',
  templateUrl: './metric-plumx.component.html',
  styleUrls: ['./metric-plumx.component.scss']
})
export class MetricPlumxComponent extends BaseMetricComponent implements OnInit {
  sanitizedInnerHtml: SafeHtml;
  private metricLoaderService: MetricLoaderService;

  constructor(protected sr: DomSanitizer,
              protected injector: Injector) {
    super();
  }

  ngOnInit() {
    if (hasValue(this.metric.remark)) {
      const script = this.metric.remark.substring(this.metric.remark.indexOf('//cdn'), this.metric.remark.indexOf('.js') + 3);
      // script is dynamic base on entityTyp and is coming from backend
      this.metricLoaderService = this.injector.get(MetricLoaderService);
      this.metricLoaderService.setScript('plumX', script);
      // show the html
      const stringToShow = this.metric.remark.substring(this.metric.remark.indexOf('<a'), this.metric.remark.indexOf('</a>') + 4);
      this.sanitizedInnerHtml = this.sr.bypassSecurityTrustHtml(stringToShow);
    }
  }
}
