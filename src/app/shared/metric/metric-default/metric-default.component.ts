import {
  Component,
  OnInit,
} from '@angular/core';

import { BaseMetricComponent } from '../metric-loader/base-metric.component';
import { TranslateModule } from '@ngx-translate/core';
import { RedirectWithHrefDirective } from '../../../directives/redirect/redirect-href.directive';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgClass, DatePipe } from '@angular/common';

@Component({
    selector: 'ds-metric-default',
    templateUrl: './metric-default.component.html',
    styleUrls: ['./metric-default.component.scss', '../metric-loader/base-metric.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        NgClass,
        NgbTooltipModule,
        RedirectWithHrefDirective,
        DatePipe,
        TranslateModule,
    ],
})
export class MetricDefaultComponent extends BaseMetricComponent implements OnInit {

  url: string;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.url = this.getDetailUrl();
  }
}
