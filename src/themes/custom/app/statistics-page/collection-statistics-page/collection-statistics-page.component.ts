import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CollectionStatisticsPageComponent as BaseComponent } from '../../../../../app/statistics-page/collection-statistics-page/collection-statistics-page.component';
import { CrisStatisticsPageComponent } from '../../../../../app/statistics-page/cris-statistics-page/cris-statistics-page.component';

@Component({
  selector: 'ds-themed-collection-statistics-page',
  // styleUrls: ['./collection-statistics-page.component.scss'],
  styleUrls: ['../../../../../app/statistics-page/collection-statistics-page/collection-statistics-page.component.scss'],
  // templateUrl: './collection-statistics-page.component.html',
  templateUrl: '../../../../../app/statistics-page/statistics-page/statistics-page.component.html',
  imports: [
    CommonModule,
    CrisStatisticsPageComponent,
    TranslateModule,
  ],
})
export class CollectionStatisticsPageComponent extends BaseComponent {
}
