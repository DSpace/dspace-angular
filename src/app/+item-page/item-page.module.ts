import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../shared/shared.module';
import { GenericItemPageFieldComponent } from './simple/field-components/specific-field/generic/generic-item-page-field.component';

import { ItemPageComponent } from './simple/item-page.component';
import { ItemPageRoutingModule } from './item-page-routing.module';
import { MetadataValuesComponent } from './field-components/metadata-values/metadata-values.component';
import { MetadataUriValuesComponent } from './field-components/metadata-uri-values/metadata-uri-values.component';
import { MetadataFieldWrapperComponent } from './field-components/metadata-field-wrapper/metadata-field-wrapper.component';
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
import { ItemPageFieldsComponent } from './simple/entity-types/item/item-page-fields.component';
import { OrgUnitPageFieldsComponent } from './simple/entity-types/orgunit/orgunit-page-fields.component';
import { PersonPageFieldsComponent } from './simple/entity-types/person/person-page-fields.component';
import { ProjectPageFieldsComponent } from './simple/entity-types/project/project-page-fields.component';

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
    ItemPageFieldComponent,
    FileSectionComponent,
    CollectionsComponent,
    FullFileSectionComponent,
    ItemPageFieldsComponent,
    ProjectPageFieldsComponent,
    OrgUnitPageFieldsComponent,
    PersonPageFieldsComponent,
    GenericItemPageFieldComponent
  ],
  entryComponents: [
    ItemPageFieldsComponent,
    ProjectPageFieldsComponent,
    OrgUnitPageFieldsComponent,
    PersonPageFieldsComponent
  ]
})
export class ItemPageModule {

}
