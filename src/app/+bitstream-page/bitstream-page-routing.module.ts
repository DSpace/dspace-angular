import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditBitstreamPageComponent } from './edit-bitstream-page/edit-bitstream-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { BitstreamPageResolver } from './bitstream-page.resolver';
import { EndUserAgreementGuard } from '../core/end-user-agreement/end-user-agreement.guard';

const EDIT_BITSTREAM_PATH = ':id/edit';

/**
 * Routing module to help navigate Bitstream pages
 */
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: EDIT_BITSTREAM_PATH,
        component: EditBitstreamPageComponent,
        resolve: {
          bitstream: BitstreamPageResolver
        },
        canActivate: [AuthenticatedGuard, EndUserAgreementGuard]
      }
    ])
  ],
  providers: [
    BitstreamPageResolver,
  ]
})
export class BitstreamPageRoutingModule {
}
