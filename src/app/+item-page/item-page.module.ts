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
import { RelatedEntitiesComponent } from './simple/related-entities/related-entities-component';
import { SearchPageModule } from '../+search-page/search-page.module';
import { PublicationComponent } from './simple/entity-types/publication/publication.component';
import { PersonComponent } from './simple/entity-types/person/person.component';
import { OrgunitComponent } from './simple/entity-types/orgunit/orgunit.component';
import { ProjectComponent } from './simple/entity-types/project/project.component';
import { JournalComponent } from './simple/entity-types/journal/journal.component';
import { JournalVolumeComponent } from './simple/entity-types/journal-volume/journal-volume.component';
import { JournalIssueComponent } from './simple/entity-types/journal-issue/journal-issue.component';
import { EntityComponent } from './simple/entity-types/shared/entity.component';
import { RelatedEntitiesSearchComponent } from './simple/related-entities/related-entities-search/related-entities-search.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ItemPageRoutingModule,
    SearchPageModule
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
    PublicationComponent,
    ProjectComponent,
    OrgunitComponent,
    PersonComponent,
    RelatedEntitiesComponent,
    EntityComponent,
    GenericItemPageFieldComponent,
    JournalComponent,
    JournalIssueComponent,
    JournalVolumeComponent,
    RelatedEntitiesSearchComponent
  ],
  entryComponents: [
    PublicationComponent,
    ProjectComponent,
    OrgunitComponent,
    PersonComponent,
    JournalComponent,
    JournalIssueComponent,
    JournalVolumeComponent
  ]
})
export class ItemPageModule {

}
