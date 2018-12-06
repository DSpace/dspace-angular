import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CommunityPageRoutingModule } from './community-page-routing.module';
import { CommunityPageComponent } from './community-page.component';
import { CommunityPageSubCollectionListComponent } from './sub-collection-list/community-page-sub-collection-list.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CommunityPageRoutingModule
  ],
  declarations: [
    CommunityPageComponent,
    CommunityPageSubCollectionListComponent,
  ]
})
export class CommunityPageModule {

}
