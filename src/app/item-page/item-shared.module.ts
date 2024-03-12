import { CommonModule, NgOptimizedImage, } from '@angular/common';
import { NgModule } from '@angular/core';
import { DYNAMIC_FORM_CONTROL_MAP_FN } from '@ng-dynamic-forms/core';
import { TranslateModule } from '@ngx-translate/core';

import {
  ItemWithdrawnReinstateModalComponent
} from '../shared/correction-suggestion/withdrawn-reinstate-modal.component';
import { SearchModule } from '../shared/search/search.module';
import {
  TabbedRelatedEntitiesSearchComponent
} from './simple/related-entities/tabbed-related-entities-search/tabbed-related-entities-search.component';
import {
  ItemVersionsDeleteModalComponent
} from './versions/item-versions-delete-modal/item-versions-delete-modal.component';
import {
  ItemVersionsSummaryModalComponent
} from './versions/item-versions-summary-modal/item-versions-summary-modal.component';
import { MetadataValuesComponent } from './field-components/metadata-values/metadata-values.component';
import {
  GenericItemPageFieldComponent
} from './simple/field-components/specific-field/generic/generic-item-page-field.component';
import { ItemPageImgFieldComponent } from './simple/field-components/specific-field/img/item-page-img-field.component';
import {
  MetadataRepresentationListComponent
} from './simple/metadata-representation-list/metadata-representation-list.component';
import {
  ThemedMetadataRepresentationListComponent
} from './simple/metadata-representation-list/themed-metadata-representation-list.component';
import {
  RelatedEntitiesSearchComponent
} from './simple/related-entities/related-entities-search/related-entities-search.component';
import { RelatedItemsComponent } from './simple/related-items/related-items-component';

import { dsDynamicFormControlMapFn } from '../shared/form/builder/ds-dynamic-form-ui/ds-dynamic-form-control-map-fn';

const ENTRY_COMPONENTS = [
  ItemVersionsDeleteModalComponent,
  ItemVersionsSummaryModalComponent,
  ItemWithdrawnReinstateModalComponent,

];

const COMPONENTS = [
  ...ENTRY_COMPONENTS,
  RelatedEntitiesSearchComponent,
  TabbedRelatedEntitiesSearchComponent,
  MetadataValuesComponent,
  GenericItemPageFieldComponent,
  MetadataRepresentationListComponent,
  ThemedMetadataRepresentationListComponent,
  RelatedItemsComponent,
  ItemPageImgFieldComponent,
];

@NgModule({
  imports: [
    CommonModule,
    SearchModule,
    TranslateModule,
    NgOptimizedImage,
    ...COMPONENTS
  ],
  exports: [
    ...COMPONENTS,
  ],
  providers: [
    {
      provide: DYNAMIC_FORM_CONTROL_MAP_FN,
      useValue: dsDynamicFormControlMapFn,
    },
    ...ENTRY_COMPONENTS,
  ],
})
export class ItemSharedModule {
}
