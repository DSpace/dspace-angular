import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThemedExternalLoginPageComponent } from './themed-external-login-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ThemedExternalLoginPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ExternalLoginPageRoutingModule { }
