import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseByTitlePageComponent } from './+browse-by-title-page/browse-by-title-page.component';
import { ItemDataService } from '../core/data/item-data.service';
import { SharedModule } from '../shared/shared.module';
import { BrowseByRoutingModule } from './browse-by-routing.module';
import { BrowseService } from '../core/browse/browse.service';
import { BrowseByMetadataPageComponent } from './+browse-by-metadata-page/browse-by-metadata-page.component';
import { BrowseByDatePageComponent } from './+browse-by-date-page/browse-by-date-page.component';
import { BrowseByGuard } from './browse-by-guard';
import { BrowseBySwitcherComponent } from './+browse-by-switcher/browse-by-switcher.component';

@NgModule({
  imports: [
    BrowseByRoutingModule,
    CommonModule,
    SharedModule
  ],
  declarations: [
    BrowseByTitlePageComponent,
    BrowseByMetadataPageComponent,
    BrowseByDatePageComponent,
    BrowseBySwitcherComponent
  ],
  providers: [
    ItemDataService,
    BrowseService,
    BrowseByGuard
  ],
  entryComponents: [
    BrowseByTitlePageComponent,
    BrowseByMetadataPageComponent,
    BrowseByDatePageComponent
  ]
})
export class BrowseByModule {

}
