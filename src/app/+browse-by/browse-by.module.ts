import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseByTitlePageComponent } from './+browse-by-title-page/browse-by-title-page.component';
import { ItemDataService } from '../core/data/item-data.service';
import { SharedModule } from '../shared/shared.module';
import { BrowseByRoutingModule } from './browse-by-routing.module';
import { BrowseService } from '../core/browse/browse.service';
import { BrowseByMetadataPageComponent } from './+browse-by-metadata-page/browse-by-metadata-page.component';

@NgModule({
  imports: [
    BrowseByRoutingModule,
    CommonModule,
    SharedModule
  ],
  declarations: [
    BrowseByTitlePageComponent,
    BrowseByMetadataPageComponent
  ],
  providers: [
    ItemDataService,
    BrowseService
  ]
})
export class BrowseByModule {

}
