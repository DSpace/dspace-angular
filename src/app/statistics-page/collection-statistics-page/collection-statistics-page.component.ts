import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { Collection } from '../../core/shared/collection.model';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { VarDirective } from '../../shared/utils/var.directive';
import { StatisticsPageDirective } from '../statistics-page/statistics-page.directive';
import { StatisticsTableComponent } from '../statistics-table/statistics-table.component';

/**
 * Component representing the statistics page for a collection.
 */
@Component({
  selector: 'ds-base-collection-statistics-page',
  templateUrl: '../statistics-page/statistics-page.component.html',
  styleUrls: ['./collection-statistics-page.component.scss'],
  standalone: true,
  imports: [CommonModule, VarDirective, ThemedLoadingComponent, StatisticsTableComponent, TranslateModule],
})
export class CollectionStatisticsPageComponent extends StatisticsPageDirective<Collection> {

  /**
   * The report types to show on this statistics page.
   */
  types: string[] = [
    'TotalVisits',
    'TotalVisitsPerMonth',
    'TopCountries',
    'TopCities',
  ];
}
