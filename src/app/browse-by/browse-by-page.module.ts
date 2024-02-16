import { NgModule } from '@angular/core';
import { BrowseByRoutingModule } from './browse-by-routing.module';
import { BrowseByModule } from './browse-by.module';
import { ItemDataService } from '../core/data/item-data.service';
import { BrowseService } from '../core/browse/browse.service';
import { BrowseByGuard } from './browse-by-guard';
import { SharedBrowseByModule } from '../shared/browse-by/shared-browse-by.module';
import { BrowseByPageComponent } from './browse-by-page/browse-by-page.component';
import { SharedModule } from '../shared/shared.module';

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
