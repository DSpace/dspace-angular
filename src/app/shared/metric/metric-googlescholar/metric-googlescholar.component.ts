import {
  Component,
  OnInit,
} from '@angular/core';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';

import { RedirectWithHrefDirective } from '../../utils/redirect-href.directive';
import { BaseMetricComponent } from '../metric-loader/base-metric.component';

@Component({
  selector: 'ds-metric-googlescholar',
  templateUrl: './metric-googlescholar.component.html',
  styleUrls: ['./metric-googlescholar.component.scss'],
  imports: [
    RedirectWithHrefDirective,
    TranslateModule,
  ],
})
export class MetricGooglescholarComponent extends BaseMetricComponent implements OnInit {

  url: string;

  constructor() {
    super();
  }

  ngOnInit() {
    this.url = this.getDetailUrl();
  }

  getDetailUrl(): any {
    try {
      const remark = this.parseRemark();
      if (hasValue(remark)) {
        return remark.href;
      }
    } catch (e) {
      console.error(e);
    }
  }
}
