import { Component } from '@angular/core';
import { CommunityStatisticsPageComponent as BaseComponent } from '../../../../../app/statistics-page/community-statistics-page/community-statistics-page.component';

@Component({
  selector: 'ds-collection-statistics-page',
  // styleUrls: ['./community-statistics-page.component.scss'],
  styleUrls: ['../../../../../app/statistics-page/community-statistics-page/community-statistics-page.component.scss'],
  // templateUrl: './community-statistics-page.component.html',
  templateUrl: '../../../../../app/statistics-page/statistics-page/statistics-page.component.html'
})

/**
 * Component to render the news section on the home page
 */
export class CommunityStatisticsPageComponent extends BaseComponent {}

