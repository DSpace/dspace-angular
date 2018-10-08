import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseByTitlePageComponent } from './+browse-by-title-page/browse-by-title-page.component';
import { ItemDataService } from '../core/data/item-data.service';
import { SharedModule } from '../shared/shared.module';
import { BrowseByRoutingModule } from './browse-by-routing.module';
import { BrowseByAuthorPageComponent } from './+browse-by-author-page/browse-by-author-page.component';
import { BrowseService } from '../core/browse/browse.service';

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
