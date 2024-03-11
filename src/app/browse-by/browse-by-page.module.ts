import { NgModule } from '@angular/core';

import { BrowseService } from '../core/browse/browse.service';
import { ItemDataService } from '../core/data/item-data.service';
import { SharedBrowseByModule } from '../shared/browse-by/shared-browse-by.module';
import { SharedModule } from '../shared/shared.module';
import { BrowseByModule } from './browse-by.module';
import { BrowseByGuard } from './browse-by-guard';
import { BrowseByPageComponent } from './browse-by-page/browse-by-page.component';
import { BrowseByRoutingModule } from './browse-by-routing.module';

const DECLARATIONS = [
  BrowseByPageComponent,
];

@NgModule({
  imports: [
    SharedBrowseByModule,
    BrowseByRoutingModule,
    BrowseByModule,
    SharedModule,
  ],
  providers: [
    ItemDataService,
    BrowseService,
    BrowseByGuard,
  ],
  declarations: [
    ...DECLARATIONS,
  ],
  exports: [
    ...DECLARATIONS,
  ],
})
export class BrowseByPageModule {

}
