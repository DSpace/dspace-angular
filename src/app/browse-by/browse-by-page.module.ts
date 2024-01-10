import { NgModule } from '@angular/core';
import { ItemDataService } from '../core/data/item-data.service';
import { BrowseService } from '../core/browse/browse.service';
import { BrowseByGuard } from './browse-by-guard';
import { SharedBrowseByModule } from '../shared/browse-by/shared-browse-by.module';

@NgModule({
  imports: [
    SharedBrowseByModule,
  ],
  providers: [
    ItemDataService,
    BrowseService,
    BrowseByGuard,
  ]
})
export class BrowseByPageModule {

}
