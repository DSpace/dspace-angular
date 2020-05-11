import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../shared/shared.module';
import { GenericItemPageFieldComponent } from './simple/field-components/specific-field/generic/generic-item-page-field.component';

import { ItemPageComponent } from './simple/item-page.component';
import { ItemPageRoutingModule } from './item-page-routing.module';
import { MetadataUriValuesComponent } from './field-components/metadata-uri-values/metadata-uri-values.component';
import { ItemPageAuthorFieldComponent } from './simple/field-components/specific-field/author/item-page-author-field.component';
import { ItemPageDateFieldComponent } from './simple/field-components/specific-field/date/item-page-date-field.component';
import { ItemPageAbstractFieldComponent } from './simple/field-components/specific-field/abstract/item-page-abstract-field.component';
import { ItemPageUriFieldComponent } from './simple/field-components/specific-field/uri/item-page-uri-field.component';
import { ItemPageTitleFieldComponent } from './simple/field-components/specific-field/title/item-page-title-field.component';
import { ItemPageFieldComponent } from './simple/field-components/specific-field/item-page-field.component';
import { FileSectionComponent } from './simple/field-components/file-section/file-section.component';
import { CollectionsComponent } from './field-components/collections/collections.component';
import { FullItemPageComponent } from './full/full-item-page.component';
import { FullFileSectionComponent } from './full/field-components/file-section/full-file-section.component';
import { RelatedItemsComponent } from './simple/related-items/related-items-component';
import { SearchPageModule } from '../+search-page/search-page.module';
import { PublicationComponent } from './simple/item-types/publication/publication.component';
import { ItemComponent } from './simple/item-types/shared/item.component';
import { EditItemPageModule } from './edit-item-page/edit-item-page.module';
import { MetadataRepresentationListComponent } from './simple/metadata-representation-list/metadata-representation-list.component';
import { RelatedEntitiesSearchComponent } from './simple/related-entities/related-entities-search/related-entities-search.component';
import { MetadataValuesComponent } from './field-components/metadata-values/metadata-values.component';
import { MetadataFieldWrapperComponent } from './field-components/metadata-field-wrapper/metadata-field-wrapper.component';
import { UploadBitstreamComponent } from './bitstreams/upload/upload-bitstream.component';
import { TabbedRelatedEntitiesSearchComponent } from './simple/related-entities/tabbed-related-entities-search/tabbed-related-entities-search.component';
import { StatisticsModule } from '../statistics/statistics.module';
import { AbstractIncrementalListComponent } from './simple/abstract-incremental-list/abstract-incremental-list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ItemPageRoutingModule,
    EditItemPageModule,
    SearchPageModule,
    StatisticsModule.forRoot()
  ],
  declarations: [
    ItemPageComponent,
    FullItemPageComponent,
    MetadataUriValuesComponent,
    ItemPageAuthorFieldComponent,
    ItemPageDateFieldComponent,
    ItemPageAbstractFieldComponent,
    ItemPageUriFieldComponent,
    ItemPageTitleFieldComponent,
    ItemPageFieldComponent,
    FileSectionComponent,
    CollectionsComponent,
    FullFileSectionComponent,
    PublicationComponent,
    RelatedItemsComponent,
    ItemComponent,
    GenericItemPageFieldComponent,
    MetadataRepresentationListComponent,
    RelatedEntitiesSearchComponent,
    UploadBitstreamComponent,
    TabbedRelatedEntitiesSearchComponent,
    AbstractIncrementalListComponent,
  ],
  exports: [
    ItemComponent,
    MetadataValuesComponent,
    MetadataFieldWrapperComponent,
    GenericItemPageFieldComponent,
    RelatedEntitiesSearchComponent,
    RelatedItemsComponent,
    MetadataRepresentationListComponent,
    ItemPageTitleFieldComponent,
    TabbedRelatedEntitiesSearchComponent
  ],
  entryComponents: [
    PublicationComponent
  ]
})
export class ItemPageModule {

}
