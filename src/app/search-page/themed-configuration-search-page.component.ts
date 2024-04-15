import {
  Component,
  Input,
} from '@angular/core';

import { Context } from '../core/shared/context.model';
import { ViewMode } from '../core/shared/view-mode.model';
import { CollectionElementLinkType } from '../shared/object-collection/collection-element-link.type';
import { SelectionConfig } from '../shared/search/search-results/search-results.component';
import { SearchConfigurationOption } from '../shared/search/search-switch-configuration/search-configuration-option.model';
import { ThemedComponent } from '../shared/theme-support/themed.component';
import { ConfigurationSearchPageComponent } from './configuration-search-page.component';

/**
 * Themed wrapper for ConfigurationSearchPageComponent
 */
@Component({
  selector: 'ds-themed-configuration-search-page',
  templateUrl: '../shared/theme-support/themed.component.html',
  standalone: true,
})
export class ThemedConfigurationSearchPageComponent extends ThemedComponent<ConfigurationSearchPageComponent> {

  @Input() configurationList: SearchConfigurationOption[] = [];

  @Input() context: Context;

  @Input() configuration: string;

  @Input() fixedFilterQuery: string;

  @Input() useCachedVersionIfAvailable: boolean;

  @Input() inPlaceSearch: boolean;

  @Input() linkType: CollectionElementLinkType;

  @Input() paginationId: string;

  @Input() searchEnabled: boolean;

  @Input() sideBarWidth: number;

  @Input() searchFormPlaceholder: string;

  @Input() selectable: boolean;

  @Input() selectionConfig: SelectionConfig;

  @Input() showCsvExport: boolean;

  @Input() showSidebar: boolean;

  @Input() showThumbnails: boolean;

  @Input() showViewModes: boolean;

  @Input() useUniquePageId: boolean;

  @Input() viewModeList: ViewMode[];

  @Input() showScopeSelector: boolean;

  @Input() trackStatistics: boolean;

  @Input() query: string;

  @Input() scope: string;

  @Input() hideScopeInUrl: boolean;

  protected inAndOutputNames: (keyof ConfigurationSearchPageComponent & keyof this)[] = [
    'configurationList',
    'context',
    'configuration',
    'fixedFilterQuery',
    'useCachedVersionIfAvailable',
    'inPlaceSearch',
    'linkType',
    'paginationId',
    'searchEnabled',
    'sideBarWidth',
    'searchFormPlaceholder',
    'selectable',
    'selectionConfig',
    'showCsvExport',
    'showSidebar',
    'showThumbnails',
    'showViewModes',
    'useUniquePageId',
    'viewModeList',
    'showScopeSelector',
    'trackStatistics',
    'query',
    'scope',
    'hideScopeInUrl',
  ];

  protected getComponentName(): string {
    return 'ConfigurationSearchPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/search-page/configuration-search-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./configuration-search-page.component');
  }

}
