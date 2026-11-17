import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CrisStatisticsPageComponent } from '../../../../../app/statistics-page/cris-statistics-page/cris-statistics-page.component';
import { SiteStatisticsPageComponent as BaseComponent } from '../../../../../app/statistics-page/site-statistics-page/site-statistics-page.component';

@Component({
  selector: 'ds-themed-site-statistics-page',
  // styleUrls: ['./site-statistics-page.component.scss'],
  styleUrls: ['../../../../../app/statistics-page/site-statistics-page/site-statistics-page.component.scss'],
  // templateUrl: './site-statistics-page.component.html',
  templateUrl: '../../../../../app/statistics-page/statistics-page/statistics-page.component.html',
  imports: [
    CommonModule,
    CrisStatisticsPageComponent,
    TranslateModule,
  ],
})
export class SiteStatisticsPageComponent extends BaseComponent {
}
