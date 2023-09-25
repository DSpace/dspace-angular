import { Component } from '@angular/core';
import { StatisticsPageDirective } from '../statistics-page/statistics-page.directive';
import { Item } from '../../core/shared/item.model';
import { TranslateModule } from '@ngx-translate/core';
import { StatisticsTableComponent } from '../statistics-table/statistics-table.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { CommonModule } from '@angular/common';
import { VarDirective } from '../../shared/utils/var.directive';

/**
 * Component representing the statistics page for an item.
 */
@Component({
    selector: 'ds-item-statistics-page',
    templateUrl: '../statistics-page/statistics-page.component.html',
    styleUrls: ['./item-statistics-page.component.scss'],
    standalone: true,
  imports: [CommonModule, VarDirective, ThemedLoadingComponent, StatisticsTableComponent, TranslateModule],
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
