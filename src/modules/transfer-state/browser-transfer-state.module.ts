import { NgModule } from '@angular/core';
import { BrowserTransferState } from './browser-transfer-state';
import { TransferState } from './transfer-state';

@NgModule({
  providers: [
    { provide: TransferState, useClass: BrowserTransferState }
  ]
})
export class BrowserTransferStateModule {

}
