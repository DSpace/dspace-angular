import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../shared/shared.module';
import { EntityPageFieldsComponent } from './simple/entity-types/shared/entity-page-fields.component';
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
import { PublicationPageFieldsComponent } from './simple/entity-types/publication/publication-page-fields.component';
import { OrgUnitPageFieldsComponent } from './simple/entity-types/orgunit/orgunit-page-fields.component';
import { PersonPageFieldsComponent } from './simple/entity-types/person/person-page-fields.component';
import { ProjectPageFieldsComponent } from './simple/entity-types/project/project-page-fields.component';
import { RelatedEntitiesComponent } from './simple/related-entities/related-entities-component';
import { JournalPageFieldsComponent } from './simple/entity-types/journal/journal-page-fields.component';
import { JournalIssuePageFieldsComponent } from './simple/entity-types/journal-issue/journal-issue-page-fields.component';
import { JournalVolumePageFieldsComponent } from './simple/entity-types/journal-volume/journal-volume-page-fields.component';

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
    PublicationPageFieldsComponent,
    ProjectPageFieldsComponent,
    OrgUnitPageFieldsComponent,
    PersonPageFieldsComponent,
    RelatedEntitiesComponent,
    EntityPageFieldsComponent,
    GenericItemPageFieldComponent,
    JournalPageFieldsComponent,
    JournalIssuePageFieldsComponent,
    JournalVolumePageFieldsComponent
  ],
  entryComponents: [
    PublicationPageFieldsComponent,
    ProjectPageFieldsComponent,
    OrgUnitPageFieldsComponent,
    PersonPageFieldsComponent,
    JournalPageFieldsComponent,
    JournalIssuePageFieldsComponent,
    JournalVolumePageFieldsComponent
  ]
})
export class ItemPageModule {

}
