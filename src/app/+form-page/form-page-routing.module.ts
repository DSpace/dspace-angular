import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormPageComponent } from './form-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: FormPageComponent, pathMatch: 'full' }
    ])
  ]
})
export class FormPageRoutingModule {

}
