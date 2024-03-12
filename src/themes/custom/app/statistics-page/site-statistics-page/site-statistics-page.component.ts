import { Component } from '@angular/core';

import {
  SiteStatisticsPageComponent as BaseComponent
} from '../../../../../app/statistics-page/site-statistics-page/site-statistics-page.component';
import { CommonModule } from '@angular/common';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import {
  StatisticsTableComponent
} from '../../../../../app/statistics-page/statistics-table/statistics-table.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-site-statistics-page',
  // styleUrls: ['./site-statistics-page.component.scss'],
  styleUrls: ['../../../../../app/statistics-page/site-statistics-page/site-statistics-page.component.scss'],
  // templateUrl: './site-statistics-page.component.html',
  templateUrl: '../../../../../app/statistics-page/statistics-page/statistics-page.component.html',
  standalone: true,
  imports: [CommonModule, VarDirective, ThemedLoadingComponent, StatisticsTableComponent, TranslateModule],
})

/**
 * Component representing the site-wide statistics page.
 */
export class SiteStatisticsPageComponent extends BaseComponent {}

