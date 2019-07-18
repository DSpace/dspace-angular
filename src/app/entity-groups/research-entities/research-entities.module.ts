import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ItemPageModule } from '../../+item-page/item-page.module';
import { OrgunitComponent } from './item-pages/orgunit/orgunit.component';
import { PersonComponent } from './item-pages/person/person.component';
import { ProjectComponent } from './item-pages/project/project.component';
import { OrgUnitListElementComponent } from './item-list-elements/orgunit/orgunit-list-element.component';
import { OrgUnitMetadataListElementComponent } from './item-list-elements/orgunit/orgunit-metadata-list-element.component';
import { PersonMetadataListElementComponent } from './item-list-elements/person/person-metadata-list-element.component';
import { PersonListElementComponent } from './item-list-elements/person/person-list-element.component';
import { ProjectListElementComponent } from './item-list-elements/project/project-list-element.component';
import { TooltipModule } from 'ngx-bootstrap';

const ENTRY_COMPONENTS = [
  OrgunitComponent,
  PersonComponent,
  ProjectComponent,
  OrgUnitListElementComponent,
  OrgUnitMetadataListElementComponent,
  PersonListElementComponent,
  PersonMetadataListElementComponent,
  ProjectListElementComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TooltipModule.forRoot(),
    ItemPageModule
  ],
  declarations: [
    ...ENTRY_COMPONENTS
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS
  ]
})
export class ResearchEntitiesModule {

}
