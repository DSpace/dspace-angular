import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { CommunityPageComponent } from './community-page.component';
import { CommunityPageSubCollectionListComponent } from './sub-collection-list/community-page-sub-collection-list.component';
import { CommunityPageRoutingModule } from './community-page-routing.module';
import {CommunityPageSubCommunityListComponent} from './sub-community-list/community-page-sub-community-list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CommunityPageRoutingModule
  ],
  declarations: [
    CommunityPageComponent,
    CommunityPageSubCollectionListComponent,
    CommunityPageSubCommunityListComponent,
  ]
})
export class CommunityPageModule {

}
