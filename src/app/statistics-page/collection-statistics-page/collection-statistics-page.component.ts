import { Component } from '@angular/core';
import { StatisticsPageDirective } from '../statistics-page/statistics-page.directive';
import { Collection } from '../../core/shared/collection.model';
import { TranslateModule } from '@ngx-translate/core';
import { StatisticsTableComponent } from '../statistics-table/statistics-table.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { CommonModule } from '@angular/common';
import { VarDirective } from '../../shared/utils/var.directive';

/**
 * Component representing the statistics page for a collection.
 */
@Component({
    selector: 'ds-collection-statistics-page',
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
