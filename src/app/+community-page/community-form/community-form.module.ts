import { NgModule } from '@angular/core';

import { CommunityFormComponent } from './community-form.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    CommunityFormComponent,
  ],
  exports: [
    CommunityFormComponent
  ]
})
export class CommunityFormModule {

}
