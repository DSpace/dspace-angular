import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { CommunityPageComponent } from './community-page.component';
import { CommunityPageSubCollectionListComponent } from './sub-collection-list/community-page-sub-collection-list.component';
import { CommunityPageRoutingModule } from './community-page-routing.module';
import { CommunityPageSubCommunityListComponent } from './sub-community-list/community-page-sub-community-list.component';
import { CreateCommunityPageComponent } from './create-community-page/create-community-page.component';
import { CommunityFormComponent } from './community-form/community-form.component';
import { EditCommunityPageComponent } from './edit-community-page/edit-community-page.component';
import { DeleteCommunityPageComponent } from './delete-community-page/delete-community-page.component';
import { StatisticsModule } from '../statistics/statistics.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CommunityPageRoutingModule,
    StatisticsModule.forRoot()
  ],
  declarations: [
    CommunityPageComponent,
    CommunityPageSubCollectionListComponent,
    CommunityPageSubCommunityListComponent,
    CreateCommunityPageComponent,
    EditCommunityPageComponent,
    DeleteCommunityPageComponent,
    CommunityFormComponent
  ]
})

export class CommunityPageModule {

}
