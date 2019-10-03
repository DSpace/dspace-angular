import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ItemPageModule } from '../../+item-page/item-page.module';
import { OrgunitComponent } from './item-pages/orgunit/orgunit.component';
import { PersonComponent } from './item-pages/person/person.component';
import { ProjectComponent } from './item-pages/project/project.component';
import { OrgUnitListElementComponent } from './item-list-elements/orgunit/orgunit-list-element.component';
import { OrgunitItemPageListElementComponent } from './item-list-elements/orgunit/orgunit-item-page-list-element.component';
import { PersonItemPageListElementComponent } from './item-list-elements/person/person-item-page-list-element.component';
import { PersonListElementComponent } from './item-list-elements/person/person-list-element.component';
import { ProjectListElementComponent } from './item-list-elements/project/project-list-element.component';
import { TooltipModule } from 'ngx-bootstrap';
import { PersonGridElementComponent } from './item-grid-elements/person/person-grid-element.component';
import { OrgunitGridElementComponent } from './item-grid-elements/orgunit/orgunit-grid-element.component';
import { ProjectGridElementComponent } from './item-grid-elements/project/project-grid-element.component';
import { OrgunitSearchResultListElementComponent } from './item-list-elements/search-result-list-elements/orgunit/orgunit-search-result-list-element.component';
import { PersonSearchResultListElementComponent } from './item-list-elements/search-result-list-elements/person/person-search-result-list-element.component';
import { ProjectSearchResultListElementComponent } from './item-list-elements/search-result-list-elements/project/project-search-result-list-element.component';
import { PersonSearchResultGridElementComponent } from './item-grid-elements/search-result-grid-elements/person/person-search-result-grid-element.component';
import { OrgunitSearchResultGridElementComponent } from './item-grid-elements/search-result-grid-elements/orgunit/orgunit-search-result-grid-element.component';
import { ProjectSearchResultGridElementComponent } from './item-grid-elements/search-result-grid-elements/project/project-search-result-grid-element.component';

const ENTRY_COMPONENTS = [
  OrgunitComponent,
  PersonComponent,
  ProjectComponent,
  OrgUnitListElementComponent,
  OrgunitItemPageListElementComponent,
  PersonListElementComponent,
  PersonItemPageListElementComponent,
  ProjectListElementComponent,
  PersonGridElementComponent,
  OrgunitGridElementComponent,
  ProjectGridElementComponent,
  OrgunitSearchResultListElementComponent,
  PersonSearchResultListElementComponent,
  ProjectSearchResultListElementComponent,
  PersonSearchResultGridElementComponent,
  OrgunitSearchResultGridElementComponent,
  ProjectSearchResultGridElementComponent
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
