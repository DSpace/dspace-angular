import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Item } from '@dspace/core/shared/item.model';
import { TranslateModule } from '@ngx-translate/core';

import { CrisStatisticsPageComponent } from '../cris-statistics-page/cris-statistics-page.component';
import { StatisticsPageDirective } from '../statistics-page/statistics-page.directive';

/**
 * Component representing the statistics page for an item.
 */
@Component({
  selector: 'ds-base-item-statistics-page',
  templateUrl: '../statistics-page/statistics-page.component.html',
  styleUrls: ['./item-statistics-page.component.scss'],
  imports: [
    CommonModule,
    CrisStatisticsPageComponent,
    TranslateModule,
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
