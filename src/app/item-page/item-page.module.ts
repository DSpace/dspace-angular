import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemPageComponent } from './item-page.component';
import { ItemPageRoutingModule } from './item-page-routing.module';
import { MetadataValuesComponent } from './metadata-values/metadata-values.component';
import { MetadataUriValuesComponent } from './metadata-uri-values/metadata-uri-values.component';
import { MetadataFieldWrapperComponent } from './metadata-field-wrapper/metadata-field-wrapper.component';
import { ItemPageAuthorFieldComponent } from './specific-field/author/item-page-author-field.component';
import { ItemPageDateFieldComponent } from './specific-field/date/item-page-date-field.component';
import { ItemPageAbstractFieldComponent } from './specific-field/abstract/item-page-abstract-field.component';
import { ItemPageUriFieldComponent } from './specific-field/uri/item-page-uri-field.component';
import { ItemPageTitleFieldComponent } from './specific-field/title/item-page-title-field.component';
import { ItemPageSpecificFieldComponent } from './specific-field/item-page-specific-field.component';
import { SharedModule } from './../shared/shared.module';
import { ThumbnailComponent } from "../thumbnail/thumbnail.component";
import { FileSectionComponent } from "./file-section/file-section.component";
import { CollectionsComponent } from "./collections/collections.component";

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
        ThumbnailComponent,
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
