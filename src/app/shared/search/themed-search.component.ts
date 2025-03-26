import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemedComponent } from '../theme-support/themed.component';
import { SearchComponent } from './search.component';
import { SearchConfigurationOption } from './search-switch-configuration/search-configuration-option.model';
import { Context } from '../../core/shared/context.model';
import { CollectionElementLinkType } from '../object-collection/collection-element-link.type';
import { SelectionConfig } from './search-results/search-results.component';
import { ViewMode } from '../../core/shared/view-mode.model';
import { SearchObjects } from './models/search-objects.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { ListableObject } from '../object-collection/shared/listable-object.model';
import { AlertType } from '../alert/alert-type';

/**
 * Themed wrapper for {@link SearchComponent}
 */
@Component({
  selector: 'ds-themed-search',
  templateUrl: '../theme-support/themed.component.html',
})
export class ThemedSearchComponent extends ThemedComponent<SearchComponent> {
  protected inAndOutputNames: (keyof SearchComponent & keyof this)[] = [
    'configurationList',
    'context',
    'configuration',
    'fixedFilterQuery',
    'forcedEmbeddedKeys',
    'hiddenQuery',
    'useCachedVersionIfAvailable',
    'collapseCharts',
    'collapseFilters',
    'inPlaceSearch',
    'linkType',
    'paginationId',
    'projection',
    'searchEnabled',
    'sideBarWidth',
    'searchFormPlaceholder',
    'selectable',
    'selectionConfig',
    'showCharts',
    'showExport',
    'showSidebar',
    'showThumbnails',
    'showViewModes',
    'useUniquePageId',
    'viewModeList',
    'showScopeSelector',
    'showFilterToggle',
    'showChartsToggle',
    'showCsvExport',
    'resultFound',
    'deselectObject',
    'selectObject',
    'customEvent',
    'trackStatistics',
    'query',
    'scope',
    'searchResultNotice',
    'searchResultNoticeType',
    'showSearchResultNotice',
    'renderOnServerSide',
    'showLabel',
    'showMetrics'
  ];

  @Input() configurationList: SearchConfigurationOption[];

  @Input() context: Context;

  @Input() configuration: string;

  @Input() fixedFilterQuery: string;

  @Input() forcedEmbeddedKeys: Map<string, string[]>;

  @Input() hiddenQuery: string;

  @Input() useCachedVersionIfAvailable: boolean;

  @Input() collapseCharts: boolean;

  @Input() collapseFilters: boolean;

  @Input() inPlaceSearch: boolean;

  @Input() linkType: CollectionElementLinkType;

  @Input() paginationId: string;

  @Input() projection;

  @Input() searchEnabled: boolean;

  @Input() sideBarWidth: number;

  @Input() searchFormPlaceholder: string;

  @Input() searchResultNotice: string;

  @Input() searchResultNoticeType: AlertType;

  @Input() selectable: boolean;

  @Input() selectionConfig: SelectionConfig;

  @Input() showCharts = false;

  @Input() showCsvExport: boolean;

  @Input() showExport: boolean;

  @Input() showLabel: boolean;

  @Input() showMetrics: boolean;

  @Input() showSidebar: boolean;

  @Input() showThumbnails: boolean;

  @Input() showViewModes: boolean;

  @Input() useUniquePageId: boolean;

  @Input() viewModeList: ViewMode[];

  @Input() showScopeSelector: boolean;

  @Input() showFilterToggle: boolean;

  @Input() showChartsToggle: boolean;

  @Input() showSearchResultNotice: boolean;

  @Input() trackStatistics: boolean;

  @Input() query: string;

  @Input() renderOnServerSide = false;

  @Input() scope: string;

  @Output() resultFound: EventEmitter<SearchObjects<DSpaceObject>> = new EventEmitter();

  @Output() deselectObject: EventEmitter<ListableObject> = new EventEmitter();

  @Output() selectObject: EventEmitter<ListableObject> = new EventEmitter();

  @Output() customEvent = new EventEmitter<any>();

  protected getComponentName(): string {
    return 'SearchComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/shared/search/search.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./search.component');
  }
}
