import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Community } from '@dspace/core/shared/community.model';
import { TranslateModule } from '@ngx-translate/core';

import { CrisStatisticsPageComponent } from '../cris-statistics-page/cris-statistics-page.component';
import { StatisticsPageDirective } from '../statistics-page/statistics-page.directive';

/**
 * Component representing the statistics page for a community.
 */
@Component({
  selector: 'ds-base-community-statistics-page',
  templateUrl: '../statistics-page/statistics-page.component.html',
  styleUrls: ['./community-statistics-page.component.scss'],
  imports: [
    CommonModule,
    CrisStatisticsPageComponent,
    TranslateModule,
  ],
})
export class CommunityStatisticsPageComponent extends StatisticsPageDirective<Community> {

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
