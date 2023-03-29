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
import { AlertType } from '../alert/aletr-type';

/**
 * Themed wrapper for SearchComponent
 */
@Component({
  selector: 'ds-themed-search',
  styleUrls: [],
  templateUrl: '../theme-support/themed.component.html',
})
export class ThemedSearchComponent extends ThemedComponent<SearchComponent> {
  protected inAndOutputNames: (keyof SearchComponent & keyof this)[] = ['configurationList', 'context', 'configuration', 'fixedFilterQuery', 'forcedEmbeddedKeys', 'useCachedVersionIfAvailable', 'collapseCharts', 'collapseFilters', 'inPlaceSearch', 'linkType', 'paginationId', 'projection', 'searchEnabled', 'sideBarWidth', 'searchFormPlaceholder', 'selectable', 'selectionConfig', 'showCharts', 'showExport', 'showSidebar', 'showViewModes', 'useUniquePageId', 'viewModeList', 'showScopeSelector', 'showFilterToggle', 'showChartsToggle', 'resultFound', 'deselectObject', 'selectObject', 'customEvent', 'trackStatistics', 'searchResultNotice', 'searchResultNoticeType', 'showSearchResultNotice'];

  @Input() configurationList: SearchConfigurationOption[] = [];

  @Input() context: Context = Context.Search;

  @Input() configuration = 'default';

  @Input() fixedFilterQuery: string;

  @Input() forcedEmbeddedKeys: Map<string, string[]> = new Map([['default', ['metrics']]]) ;

  @Input() useCachedVersionIfAvailable = true;

  @Input() collapseCharts = false;

  @Input() collapseFilters = false;

  @Input() inPlaceSearch = true;

  @Input() linkType: CollectionElementLinkType;

  @Input() paginationId = 'spc';

  @Input() projection;

  @Input() searchEnabled = true;

  @Input() sideBarWidth = 3;

  @Input() searchFormPlaceholder = 'search.search-form.placeholder';

  @Input() searchResultNotice: string = null;

  @Input() searchResultNoticeType: AlertType = AlertType.Info;

  @Input() selectable = false;

  @Input() selectionConfig: SelectionConfig;

  @Input() showCharts = false;

  @Input() showExport = true;

  @Input() showSidebar = true;

  @Input() showViewModes = true;

  @Input() useUniquePageId: false;

  @Input() viewModeList: ViewMode[];

  @Input() showScopeSelector = true;

  @Input() showFilterToggle = false;

  @Input() showChartsToggle = false;

  @Input() showSearchResultNotice = false;

  @Input() trackStatistics = false;

  @Output() resultFound: EventEmitter<SearchObjects<DSpaceObject>> = new EventEmitter<SearchObjects<DSpaceObject>>();

  @Output() deselectObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();

  @Output() selectObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();

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
