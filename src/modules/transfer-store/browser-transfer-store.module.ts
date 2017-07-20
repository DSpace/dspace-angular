import { NgModule } from '@angular/core';
import { BrowserTransferStoreEffects } from './browser-transfer-store.effects';
import { TransferStoreEffects } from './transfer-store.effects';

@NgModule({
  providers: [
    { provide: TransferStoreEffects, useClass: BrowserTransferStoreEffects }
  ]
})
export class BrowserTransferStoreModule {

}
