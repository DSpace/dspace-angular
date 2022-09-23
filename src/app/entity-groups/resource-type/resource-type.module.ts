import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { ItemSharedModule } from '../../item-page/item-shared.module';
import { ResourceTypeListElementComponent } from './item-list-elements/resource-type-list-element.component';
import { ResourceTypeSearchResultListElementComponent } from './search-result-list-elements/resource-type-search-result-list-element.component';
import { ResourceTypeSidebarSearchListElementComponent } from './sidebar-search-list-elements/resource-type-sidebar-search-list-element.component';
import { ResourceTypeGridElementComponent } from './item-grid-elements/resource-type-grid-element.component';
import { ResourceTypeSearchResultGridElementComponent } from './search-result-grid-elements/resource-type-search-result-grid-element.component';
import { ResourceTypeComponent } from './item-page/resource-type.component';
import { ItemPageFieldLocaleComponent } from '../../item-page/simple/field-components/specific-field/metadata-value-locale/item-page-field-locale.component';
import { MetadataValuesLocaleComponent } from '../../item-page/field-components/metadata-value-locale/metadata-values/metadata-values-locale.component';

const ENTRY_COMPONENTS = [
// put only entry components that use custom decorator
  ResourceTypeComponent,
  ResourceTypeListElementComponent,
  ResourceTypeSearchResultListElementComponent,
  ResourceTypeSidebarSearchListElementComponent,
  ResourceTypeGridElementComponent,
  ResourceTypeSearchResultGridElementComponent,
  ItemPageFieldLocaleComponent,
  MetadataValuesLocaleComponent,
];

const COMPONENTS = [
  ...ENTRY_COMPONENTS
];

@NgModule({
  imports: [
    CommonModule,
    ItemSharedModule,
    SharedModule,
    NgbTooltipModule,
  ],
  declarations: [
    ...COMPONENTS,
  ]
})
export class ResourceTypeModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during SSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: ResourceTypeModule,
      providers: ENTRY_COMPONENTS.map((component) => ({ provide: component }))
    };
  }
}
