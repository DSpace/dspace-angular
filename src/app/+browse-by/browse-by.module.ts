import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BrowseByRoutingModule } from './browse-by-routing.module';
import { BrowseService } from '../core/browse/browse.service';
import { ItemDataService } from '../core/data/item-data.service';
import { SharedModule } from '../shared/shared.module';
import { BrowseByTitlePageComponent } from './+browse-by-title-page/browse-by-title-page.component';
import { BrowseByAuthorPageComponent } from './+browse-by-author-page/browse-by-author-page.component';

@NgModule({
  imports: [
    BrowseByRoutingModule,
    CommonModule,
    SharedModule
  ],
  declarations: [
    BrowseByTitlePageComponent,
    BrowseByAuthorPageComponent
  ],
  providers: [
    ItemDataService,
    BrowseService
  ]
})
export class BrowseByModule {

}
