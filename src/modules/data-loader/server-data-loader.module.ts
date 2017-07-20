import { NgModule } from '@angular/core';

import { DataLoader } from './data-loader';
import { ServerDataLoader } from './server-data-loader';

@NgModule({
  providers: [
    { provide: DataLoader, useClass: ServerDataLoader }
  ]
})
export class ServerDataLoaderModule {

}
