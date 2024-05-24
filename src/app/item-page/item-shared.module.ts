import {
  CommonModule,
  NgOptimizedImage,
} from '@angular/common';
import { NgModule } from '@angular/core';
import { DYNAMIC_FORM_CONTROL_MAP_FN } from '@ng-dynamic-forms/core';
import { TranslateModule } from '@ngx-translate/core';

import { ItemWithdrawnReinstateModalComponent } from '../shared/correction-suggestion/withdrawn-reinstate-modal.component';
import { dsDynamicFormControlMapFn } from '../shared/form/builder/ds-dynamic-form-ui/ds-dynamic-form-control-container.component';
import { SearchModule } from '../shared/search/search.module';
import { SharedModule } from '../shared/shared.module';
import { ItemAlertsComponent } from './alerts/item-alerts.component';
import { MetadataValuesComponent } from './field-components/metadata-values/metadata-values.component';
import { GenericItemPageFieldComponent } from './simple/field-components/specific-field/generic/generic-item-page-field.component';
import { MetadataRepresentationListComponent } from './simple/metadata-representation-list/metadata-representation-list.component';
import { ThemedMetadataRepresentationListComponent } from './simple/metadata-representation-list/themed-metadata-representation-list.component';
import { RelatedEntitiesSearchComponent } from './simple/related-entities/related-entities-search/related-entities-search.component';
import { TabbedRelatedEntitiesSearchComponent } from './simple/related-entities/tabbed-related-entities-search/tabbed-related-entities-search.component';
import { RelatedItemsComponent } from './simple/related-items/related-items-component';
import { ItemVersionsDeleteModalComponent } from './versions/item-versions-delete-modal/item-versions-delete-modal.component';
import { ItemVersionsSummaryModalComponent } from './versions/item-versions-summary-modal/item-versions-summary-modal.component';

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
  ItemAlertsComponent,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    CommonModule,
    SearchModule,
    SharedModule,
    TranslateModule,
    NgOptimizedImage,
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
export class ItemSharedModule { }
