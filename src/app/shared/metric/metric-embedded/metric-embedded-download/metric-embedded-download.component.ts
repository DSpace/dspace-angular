import { Component, OnInit, Renderer2 } from '@angular/core';
import { BaseEmbeddedHtmlMetricComponent } from '../base-embedded-html-metric.component';

@Component({
  selector: 'ds-metric-embedded-download',
  templateUrl: './metric-embedded-download.component.html',
  styleUrls: ['./metric-embedded-download.component.scss', '../../metric-loader/base-metric.component.scss']
})
export class MetricEmbeddedDownloadComponent extends BaseEmbeddedHtmlMetricComponent implements OnInit {

  constructor(protected render: Renderer2) {
    super(render);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
