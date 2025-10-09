import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { Context } from '../../core/shared/context.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { ViewMode } from '../../core/shared/view-mode.model';
import { CollectionElementLinkType } from '../object-collection/collection-element-link.type';
import { ListableObject } from '../object-collection/shared/listable-object.model';
import { ThemedComponent } from '../theme-support/themed.component';
import { SearchObjects } from './models/search-objects.model';
import { SearchComponent } from './search.component';
import { SelectionConfig } from './search-results/search-results.component';
import { SearchConfigurationOption } from './search-switch-configuration/search-configuration-option.model';

/**
 * Themed wrapper for {@link SearchComponent}
 */
@Component({
  selector: 'ds-search',
  templateUrl: '../theme-support/themed.component.html',
  standalone: true,
  imports: [
    SearchComponent,
  ],
})
export class ThemedSearchComponent extends ThemedComponent<SearchComponent> {

  protected inAndOutputNames: (keyof SearchComponent & keyof this)[] = [
    'configurationList',
    'context',
    'configuration',
    'fixedFilterQuery',
    'hiddenQuery',
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
    'resultFound',
    'deselectObject',
    'selectObject',
  ];

  @Input() configurationList: SearchConfigurationOption[];

  @Input() context: Context;

  @Input() configuration: string;

  @Input() fixedFilterQuery: string;

  @Input() hiddenQuery: string;

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

  @Output() resultFound: EventEmitter<SearchObjects<DSpaceObject>> = new EventEmitter();

  @Output() deselectObject: EventEmitter<ListableObject> = new EventEmitter();

  @Output() selectObject: EventEmitter<ListableObject> = new EventEmitter();

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
