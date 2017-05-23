import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemPageComponent } from './simple/item-page.component';
import { ItemPageRoutingModule } from './item-page-routing.module';
import { MetadataValuesComponent } from './simple/metadata-values/metadata-values.component';
import { MetadataUriValuesComponent } from './simple/metadata-uri-values/metadata-uri-values.component';
import { MetadataFieldWrapperComponent } from './simple/metadata-field-wrapper/metadata-field-wrapper.component';
import { ItemPageAuthorFieldComponent } from './simple/specific-field/author/item-page-author-field.component';
import { ItemPageDateFieldComponent } from './simple/specific-field/date/item-page-date-field.component';
import { ItemPageAbstractFieldComponent } from './simple/specific-field/abstract/item-page-abstract-field.component';
import { ItemPageUriFieldComponent } from './simple/specific-field/uri/item-page-uri-field.component';
import { ItemPageTitleFieldComponent } from './simple/specific-field/title/item-page-title-field.component';
import { ItemPageSpecificFieldComponent } from './simple/specific-field/item-page-specific-field.component';
import { SharedModule } from './../shared/shared.module';
import { FileSectionComponent } from "./simple/file-section/file-section.component";
import { CollectionsComponent } from "./simple/collections/collections.component";

@NgModule({
    declarations: [
        ItemPageComponent,
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
        CollectionsComponent
    ],
    imports: [
        ItemPageRoutingModule,
        CommonModule,
        SharedModule
    ]
})
export class ItemPageModule {
}
