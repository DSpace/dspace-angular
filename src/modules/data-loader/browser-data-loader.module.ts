import { NgModule } from '@angular/core';

import { DataLoader } from './data-loader';
import { BrowserDataLoader } from './browser-data-loader';

@NgModule({
  providers: [
    { provide: DataLoader, useClass: BrowserDataLoader }
  ]
})
export class BrowserDataLoaderModule {

}
