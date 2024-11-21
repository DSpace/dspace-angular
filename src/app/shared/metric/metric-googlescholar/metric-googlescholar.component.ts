import { NgIf } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { RedirectWithHrefDirective } from '../../../directives/redirect/redirect-href.directive';
import { hasValue } from '../../empty.util';
import { BaseMetricComponent } from '../metric-loader/base-metric.component';

@Component({
  selector: 'ds-metric-googlescholar',
  templateUrl: './metric-googlescholar.component.html',
  styleUrls: ['./metric-googlescholar.component.scss'],
  standalone: true,
  imports: [
    RedirectWithHrefDirective,
    NgIf,
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
      /* */
    }
  }
}
