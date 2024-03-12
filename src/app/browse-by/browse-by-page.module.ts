import { NgModule } from '@angular/core';

import { ItemDataService } from '../core/data/item-data.service';
import { SharedBrowseByModule } from '../shared/browse-by/shared-browse-by.module';
import { BrowseByGuard } from './browse-by-guard';
import { BrowseByPageComponent } from './browse-by-page/browse-by-page.component';


@NgModule({
  imports: [
    SharedBrowseByModule,
    BrowseByPageComponent,
  ],
  providers: [
    ItemDataService,
    BrowseService,
    BrowseByGuard,
  ],
})
export class BrowseByPageModule {

}
