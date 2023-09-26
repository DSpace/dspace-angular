import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThemedExternalLoginValidationPageComponent } from './themed-external-login-validation-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ThemedExternalLoginValidationPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalLoginValidationPageRoutingModule { }
