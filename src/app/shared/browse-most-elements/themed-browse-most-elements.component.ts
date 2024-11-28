import { TopSection } from '../../core/layout/models/section.model';
import { Component, Input } from '@angular/core';
import { ThemedComponent } from '../theme-support/themed.component';
import { BrowseMostElementsComponent } from './browse-most-elements.component';
import { Context } from '../../core/shared/context.model';
import { PaginatedSearchOptions } from '../search/models/paginated-search-options.model';

/**
 * Themed wrapper for BrowseMostElementsComponent
 */
@Component({
  selector: 'ds-themed-browse-most-elements',
  styleUrls: [],
  templateUrl: '../theme-support/themed.component.html',
})
export class ThemedBrowseMostElementsComponent extends ThemedComponent<BrowseMostElementsComponent> {

  @Input() context: Context;

  @Input() paginatedSearchOptions: PaginatedSearchOptions;

  @Input() projection: string;

  @Input() showLabel: boolean;

  @Input() showMetrics: boolean;

  @Input() showThumbnails: boolean;

  @Input() topSection: TopSection;

  protected inAndOutputNames: (keyof BrowseMostElementsComponent & keyof this)[] = ['context', 'paginatedSearchOptions', 'projection', 'showLabel', 'showMetrics', 'showThumbnails', 'topSection'];

  protected getComponentName(): string {
    return 'BrowseMostElementsComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/browse-most-elements/browse-most-elements.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./browse-most-elements.component`);
  }
}
