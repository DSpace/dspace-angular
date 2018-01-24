import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { MyDspacePageRoutingModule } from './my-dspace-page-routing.module';
import { MyDSpacePageComponent } from './my-dspace-page.component';
import { SearchPageModule } from '../+search-page/search-page.module';
import { MyDSpaceResultsComponent } from './my-dspace-results/my-dspace-results.component';
import { MyDspaceService } from './my-dspace-service/my-dspace.service';
import { WorkspaceitemMyDSpaceResultListElementComponent } from '../shared/object-list/my-dspace-result-list-element/wsi-my-dspace-result/wsi-my-dspace-result-list-element.component';
import { ItemMyDSpaceResultListElementComponent } from '../shared/object-list/my-dspace-result-list-element/item-my-dspace-result/item-my-dspace-result-list-element.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MyDspacePageRoutingModule,
    SearchPageModule
  ],
  declarations: [
    ItemMyDSpaceResultListElementComponent,
    MyDSpacePageComponent,
    MyDSpaceResultsComponent,
    WorkspaceitemMyDSpaceResultListElementComponent
  ],
  providers: [
    MyDspaceService
  ],
  entryComponents: [
    ItemMyDSpaceResultListElementComponent,
    WorkspaceitemMyDSpaceResultListElementComponent,
  ]
})
export class MyDSpacePageModule {

}
