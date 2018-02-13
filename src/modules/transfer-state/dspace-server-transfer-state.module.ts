import { NgModule } from '@angular/core';
import { ServerTransferStateModule } from '@angular/platform-server';
import { DSpaceServerTransferState } from './dspace-server-transfer-state.service';
import { DSpaceTransferState } from './dspace-transfer-state.service';

@NgModule({
  imports: [
    ServerTransferStateModule
  ],
  providers: [
    { provide: DSpaceTransferState, useClass: DSpaceServerTransferState }
  ]
})
export class DSpaceServerTransferStateModule {

}
