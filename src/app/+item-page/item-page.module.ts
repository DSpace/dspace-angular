import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { CollectionsComponent } from './field-components/collections/collections.component';
import { MetadataFieldWrapperComponent } from './field-components/metadata-field-wrapper/metadata-field-wrapper.component';
import { MetadataUriValuesComponent } from './field-components/metadata-uri-values/metadata-uri-values.component';
import { MetadataValuesComponent } from './field-components/metadata-values/metadata-values.component';
import { FullFileSectionComponent } from './full/field-components/file-section/full-file-section.component';
import { FullItemPageComponent } from './full/full-item-page.component';
import { ItemPageRoutingModule } from './item-page-routing.module';
import { FileSectionComponent } from './simple/field-components/file-section/file-section.component';
import { ItemPageAbstractFieldComponent } from './simple/field-components/specific-field/abstract/item-page-abstract-field.component';
import { ItemPageAuthorFieldComponent } from './simple/field-components/specific-field/author/item-page-author-field.component';
import { ItemPageDateFieldComponent } from './simple/field-components/specific-field/date/item-page-date-field.component';
import { ItemPageSpecificFieldComponent } from './simple/field-components/specific-field/item-page-specific-field.component';
import { ItemPageTitleFieldComponent } from './simple/field-components/specific-field/title/item-page-title-field.component';
import { ItemPageUriFieldComponent } from './simple/field-components/specific-field/uri/item-page-uri-field.component';
import { ItemPageComponent } from './simple/item-page.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ItemPageRoutingModule
  ],
  declarations: [
    ItemPageComponent,
    FullItemPageComponent,
    MetadataValuesComponent,
    MetadataUriValuesComponent,
    MetadataFieldWrapperComponent,
    ItemPageAuthorFieldComponent,
    ItemPageDateFieldComponent,
    ItemPageAbstractFieldComponent,
    ItemPageUriFieldComponent,
    ItemPageTitleFieldComponent,
    ItemPageSpecificFieldComponent,
    FileSectionComponent,
    CollectionsComponent,
    FullFileSectionComponent
  ]
})
export class ItemPageModule {

}
