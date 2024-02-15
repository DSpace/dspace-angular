import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemedComponent } from '../theme-support/themed.component';
import { SearchConfigurationOption } from './search-switch-configuration/search-configuration-option.model';
import { Context } from '../../core/shared/context.model';
import { CollectionElementLinkType } from '../object-collection/collection-element-link.type';
import { SelectionConfig } from './search-results/search-results.component';
import { ViewMode } from '../../core/shared/view-mode.model';
import { SearchObjects } from './models/search-objects.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { ListableObject } from '../object-collection/shared/listable-object.model';
import { ClarinSearchComponent } from './clarin-search/clarin-search.component';

/**
 * Themed wrapper for {@link SearchComponent}
 */
@Component({
  selector: 'ds-themed-search',
  styleUrls: [],
  templateUrl: '../theme-support/themed.component.html',
})
export class ThemedSearchComponent extends ThemedComponent<ClarinSearchComponent> {
  protected inAndOutputNames: (keyof ClarinSearchComponent & keyof this)[] = ['configurationList', 'context', 'configuration', 'fixedFilterQuery', 'useCachedVersionIfAvailable', 'inPlaceSearch', 'linkType', 'paginationId', 'searchEnabled', 'sideBarWidth', 'searchFormPlaceholder', 'selectable', 'selectionConfig', 'showCsvExport', 'showSidebar', 'showThumbnails', 'showViewModes', 'useUniquePageId', 'viewModeList', 'showScopeSelector', 'resultFound', 'deselectObject', 'selectObject', 'trackStatistics', 'query'];

  @Input() configurationList: SearchConfigurationOption[];

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

  @Input() showThumbnails;

  @Input() showViewModes: boolean;

  @Input() useUniquePageId: boolean;

  @Input() viewModeList: ViewMode[];

  @Input() showScopeSelector: boolean;

  @Input() trackStatistics: boolean;

  @Input() query: string;

  @Output() resultFound: EventEmitter<SearchObjects<DSpaceObject>> = new EventEmitter();

  @Output() deselectObject: EventEmitter<ListableObject> = new EventEmitter();

  @Output() selectObject: EventEmitter<ListableObject> = new EventEmitter();

  protected getComponentName(): string {
    return 'ClarinSearchComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/shared/search/search.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./clarin-search/clarin-search.component');
  }
}
