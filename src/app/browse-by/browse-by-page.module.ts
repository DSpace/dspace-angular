import { NgModule } from '@angular/core';

import { BrowseService } from '../core/browse/browse.service';
import { ItemDataService } from '../core/data/item-data.service';
import { SharedBrowseByModule } from '../shared/browse-by/shared-browse-by.module';
import { BrowseByModule } from './browse-by.module';
import { BrowseByGuard } from './browse-by-guard';
import { BrowseByRoutingModule } from './browse-by-routing.module';

@NgModule({
  imports: [
    SharedBrowseByModule,
    BrowseByRoutingModule,
    BrowseByModule.withEntryComponents(),
  ],
  providers: [
    ItemDataService,
    BrowseService,
    BrowseByGuard,
  ],
  declarations: [

  ],
})
export class BrowseByPageModule {

}
