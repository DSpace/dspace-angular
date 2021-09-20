import { NgModule } from '@angular/core';
import { BrowseByRoutingModule } from './browse-by-routing.module';
import { BrowseByModule } from './browse-by.module';
import { ItemDataService } from '../core/data/item-data.service';
import { BrowseService } from '../core/browse/browse.service';
import { BrowseByGuard } from './browse-by-guard';

@NgModule({
  imports: [
    BrowseByRoutingModule,
    BrowseByModule.withEntryComponents()
  ],
  providers: [
    ItemDataService,
    BrowseService,
    BrowseByGuard
  ]
})
export class BrowseByPageModule {

}
