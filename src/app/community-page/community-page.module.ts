import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BrowseByPageModule } from '../browse-by/browse-by-page.module';
import { ComcolModule } from '../shared/comcol/comcol.module';
import { DsoPageModule } from '../shared/dso-page/dso-page.module';
import { SharedModule } from '../shared/shared.module';
import { StatisticsModule } from '../statistics/statistics.module';
import { CommunityFormModule } from './community-form/community-form.module';
import { CommunityPageComponent } from './community-page.component';
import { CommunityPageRoutingModule } from './community-page-routing.module';
import { CreateCommunityPageComponent } from './create-community-page/create-community-page.component';
import { DeleteCommunityPageComponent } from './delete-community-page/delete-community-page.component';
import {
  CommunityPageSubCollectionListComponent
} from './sections/sub-com-col-section/sub-collection-list/community-page-sub-collection-list.component';
import {
  ThemedCollectionPageSubCollectionListComponent
} from './sections/sub-com-col-section/sub-collection-list/themed-community-page-sub-collection-list.component';
import { SubComColSectionComponent } from './sections/sub-com-col-section/sub-com-col-section.component';
import {
  CommunityPageSubCommunityListComponent
} from './sections/sub-com-col-section/sub-community-list/community-page-sub-community-list.component';
import {
  ThemedCommunityPageSubCommunityListComponent
} from './sections/sub-com-col-section/sub-community-list/themed-community-page-sub-community-list.component';
import { ContextMenuModule } from '../shared/context-menu/context-menu.module';
import { ThemedCommunityPageComponent } from './themed-community-page.component';

const DECLARATIONS = [
  CommunityPageComponent,
  ThemedCommunityPageComponent,
  ThemedCommunityPageSubCommunityListComponent,
  CommunityPageSubCollectionListComponent,
  ThemedCollectionPageSubCollectionListComponent,
  CommunityPageSubCommunityListComponent,
  CreateCommunityPageComponent,
  DeleteCommunityPageComponent,
  SubComColSectionComponent,
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CommunityPageRoutingModule,
    StatisticsModule.forRoot(),
    CommunityFormModule,
    ComcolModule,
    DsoPageModule,
    BrowseByPageModule,
    ContextMenuModule.withEntryComponents(),
  ],
  declarations: [
    ...DECLARATIONS,
  ],
  exports: [
    ...DECLARATIONS,
  ],
})

export class CommunityPageModule {

}
