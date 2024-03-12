import { Component } from '@angular/core';

import {
  CollectionStatisticsPageComponent as BaseComponent
} from '../../../../../app/statistics-page/collection-statistics-page/collection-statistics-page.component';
import { CommonModule } from '@angular/common';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import {
  StatisticsTableComponent
} from '../../../../../app/statistics-page/statistics-table/statistics-table.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-collection-statistics-page',
  // styleUrls: ['./collection-statistics-page.component.scss'],
  styleUrls: ['../../../../../app/statistics-page/collection-statistics-page/collection-statistics-page.component.scss'],
  // templateUrl: './collection-statistics-page.component.html',
  templateUrl: '../../../../../app/statistics-page/statistics-page/statistics-page.component.html',
  standalone: true,
  imports: [CommonModule, VarDirective, ThemedLoadingComponent, StatisticsTableComponent, TranslateModule],
})

/**
 * Component representing the statistics page for a collection.
 */
export class CollectionStatisticsPageComponent extends BaseComponent {}

