import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormPageComponent } from './form-page.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: 'forms', component: FormPageComponent, pathMatch: 'full' }
    ])
  ]
})
export class FormPageRoutingModule {

}
