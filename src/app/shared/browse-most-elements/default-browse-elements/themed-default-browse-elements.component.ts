import { Context } from '../../../core/shared/context.model';
import { ThemedComponent } from '../../theme-support/themed.component';
import { TopSection } from '../../../core/layout/models/section.model';
import { PaginatedSearchOptions } from '../../search/models/paginated-search-options.model';
import { DefaultBrowseElementsComponent } from './default-browse-elements.component';
import { Component, Input } from '@angular/core';

/**
 * Themed component for the DefaultBrowseElementsComponent.
 */
@Component({
  selector: 'ds-themed-default-browse-elements',
  styleUrls: [],
  templateUrl: './../../theme-support/themed.component.html',
})
export class ThemedDefaultBrowseElementsComponent extends ThemedComponent<DefaultBrowseElementsComponent> {

  // AbstractBrowseElementsComponent I/O variables

  @Input() paginatedSearchOptions: PaginatedSearchOptions;

  @Input() context: Context;

  @Input() topSection: TopSection;

  // DefaultBrowseElementsComponent I/O variables

  @Input() projection: string;

  @Input() showMetrics: boolean;

  @Input() showThumbnails: boolean;

  @Input() showLabel: boolean;

  protected inAndOutputNames: (keyof DefaultBrowseElementsComponent & keyof this)[] = ['paginatedSearchOptions', 'context', 'showMetrics', 'showThumbnails', 'showLabel', 'projection'];

  protected getComponentName(): string {
    return 'DefaultBrowseElementsComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`./../../../../themes/${themeName}/app/shared/browse-most-elements/default-browse-elements/default-browse-elements.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./default-browse-elements.component`);
  }
}
