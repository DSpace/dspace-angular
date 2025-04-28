import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';
import { ItemStatisticsPageComponent as BaseComponent } from '../../../../../app/statistics-page/item-statistics-page/item-statistics-page.component';
import { StatisticsTableComponent } from '../../../../../app/statistics-page/statistics-table/statistics-table.component';

@Component({
  selector: 'ds-themed-item-statistics-page',
  // styleUrls: ['./item-statistics-page.component.scss'],
  styleUrls: ['../../../../../app/statistics-page/item-statistics-page/item-statistics-page.component.scss'],
  // templateUrl: './item-statistics-page.component.html',
  templateUrl: '../../../../../app/statistics-page/statistics-page/statistics-page.component.html',
  standalone: true,
  imports: [CommonModule, VarDirective, ThemedLoadingComponent, StatisticsTableComponent, TranslateModule],
})

/**
 * Component representing the statistics page for an item.
 */
export class ItemStatisticsPageComponent extends BaseComponent {}

