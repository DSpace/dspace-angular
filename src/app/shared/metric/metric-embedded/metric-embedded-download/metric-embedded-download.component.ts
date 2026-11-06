import {
  Component,
  OnInit,
  Renderer2,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { RedirectWithHrefDirective } from '../../../utils/redirect-href.directive';
import { BaseEmbeddedHtmlMetricComponent } from '../base-embedded-html-metric.component';

export const METRIC_TYPE_DOWNLOAD = 'TotalDownloads';
@Component({
  selector: 'ds-metric-embedded-download',
  templateUrl: './metric-embedded-download.component.html',
  styleUrls: ['./metric-embedded-download.component.scss', '../../metric-loader/base-metric.component.scss'],
  imports: [
    RedirectWithHrefDirective,
    TranslateModule,
  ],
})
export class MetricEmbeddedDownloadComponent extends BaseEmbeddedHtmlMetricComponent implements OnInit {

  constructor(protected render: Renderer2) {
    super(render);
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.href) {
      this.href += (this.href.includes('?') ? '&' : '?') + 'reportType=' + METRIC_TYPE_DOWNLOAD;
    }
  }

}
