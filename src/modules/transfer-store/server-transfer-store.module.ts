import { NgModule } from '@angular/core';
import { ServerTransferStoreEffects } from './server-transfer-store.effects';
import { TransferStoreEffects } from './transfer-store.effects';

@NgModule({
  providers: [
    { provide: TransferStoreEffects, useClass: ServerTransferStoreEffects }
  ]
})
export class ServerTransferStoreModule {

}
