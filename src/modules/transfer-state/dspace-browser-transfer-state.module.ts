import { NgModule } from '@angular/core';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { DSpaceBrowserTransferState } from './dspace-browser-transfer-state.service';
import { DSpaceTransferState } from './dspace-transfer-state.service';

@NgModule({
  imports: [
    BrowserTransferStateModule
  ],
  providers: [
    { provide: DSpaceTransferState, useClass: DSpaceBrowserTransferState }
  ]
})
export class DSpaceBrowserTransferStateModule {

}
