import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';
import { CommunityPageComponent } from './community-page.component';
import { CommunityPageSubCollectionListComponent } from './sub-collection-list/community-page-sub-collection-list.component';
import { CommunityPageRoutingModule } from './community-page-routing.module';

@NgModule({
  imports: [
    CommunityPageRoutingModule,
    CommonModule,
    TranslateModule,
    RouterModule,
    SharedModule,
  ],
  declarations: [
    CommunityPageComponent,
    CommunityPageSubCollectionListComponent,
  ]
})
export class CommunityPageModule { }
