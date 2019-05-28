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
import { PersonComponent } from './simple/item-types/person/person.component';
import { OrgunitComponent } from './simple/item-types/orgunit/orgunit.component';
import { ProjectComponent } from './simple/item-types/project/project.component';
import { JournalComponent } from './simple/item-types/journal/journal.component';
import { JournalVolumeComponent } from './simple/item-types/journal-volume/journal-volume.component';
import { JournalIssueComponent } from './simple/item-types/journal-issue/journal-issue.component';
import { ItemComponent } from './simple/item-types/shared/item.component';
import { EditItemPageModule } from './edit-item-page/edit-item-page.module';
import { MetadataRepresentationListComponent } from './simple/metadata-representation-list/metadata-representation-list.component';
import { RelatedEntitiesSearchComponent } from './simple/related-entities/related-entities-search/related-entities-search.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EditItemPageModule,
    ItemPageRoutingModule,
    SearchPageModule
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
    ProjectComponent,
    OrgunitComponent,
    PersonComponent,
    RelatedItemsComponent,
    ItemComponent,
    GenericItemPageFieldComponent,
    JournalComponent,
    JournalIssueComponent,
    JournalVolumeComponent,
    MetadataRepresentationListComponent,
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
