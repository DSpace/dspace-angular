import { NgModule } from '@angular/core';

import { ComcolModule } from '../../shared/comcol/comcol.module';
import { FormModule } from '../../shared/form/form.module';
import { SharedModule } from '../../shared/shared.module';
import { CommunityFormComponent } from './community-form.component';

@NgModule({
  imports: [
    ComcolModule,
    FormModule,
    SharedModule,
  ],
  declarations: [
    CommunityFormComponent,
  ],
  exports: [
    CommunityFormComponent,
  ],
})
export class CommunityFormModule {

}
