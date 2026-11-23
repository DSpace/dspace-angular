import { Component } from '@angular/core';
import { Collection } from '@dspace/core/shared/collection.model';
import { TranslateModule } from '@ngx-translate/core';

import { CrisStatisticsPageComponent } from '../cris-statistics-page/cris-statistics-page.component';
import { StatisticsPageDirective } from '../statistics-page/statistics-page.directive';

/**
 * Component representing the statistics page for a collection.
 */
@Component({
  selector: 'ds-base-collection-statistics-page',
  templateUrl: '../statistics-page/statistics-page.component.html',
  styleUrls: ['./collection-statistics-page.component.scss'],
  imports: [
    CrisStatisticsPageComponent,
    TranslateModule,
  ],
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
