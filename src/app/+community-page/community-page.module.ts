import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { CommunityPageComponent } from './community-page.component';
import { CommunityPageSubCollectionListComponent } from './sub-collection-list/community-page-sub-collection-list.component';
import { CommunityPageRoutingModule } from './community-page-routing.module';
import { CreateCommunityPageComponent } from './create-community-page/create-community-page.component';
import { CommunityFormComponent } from './community-form/community-form.component';
import { EditCommunityPageComponent } from './edit-community-page/edit-community-page.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CommunityPageRoutingModule
  ],
  declarations: [
    CommunityPageComponent,
    CommunityPageSubCollectionListComponent,
    CreateCommunityPageComponent,
    EditCommunityPageComponent,
    CommunityFormComponent
  ]
})
export class CommunityPageModule {

}
