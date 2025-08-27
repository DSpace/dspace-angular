import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { Item } from '../../core/shared/item.model';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { VarDirective } from '../../shared/utils/var.directive';
import { StatisticsPageDirective } from '../statistics-page/statistics-page.directive';
import { StatisticsTableComponent } from '../statistics-table/statistics-table.component';

/**
 * Component representing the statistics page for an item.
 */
@Component({
  selector: 'ds-base-item-statistics-page',
  templateUrl: '../statistics-page/statistics-page.component.html',
  styleUrls: ['./item-statistics-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    StatisticsTableComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class ItemStatisticsPageComponent extends StatisticsPageDirective<Item> {

  /**
   * The report types to show on this statistics page.
   */
  types: string[] = [
    'TotalVisits',
    'TotalVisitsPerMonth',
    'TotalDownloads',
    'TopCountries',
    'TopCities',
  ];
}
