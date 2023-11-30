import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExternalLoginEmailConfirmationPageComponent } from './external-login-email-confirmation-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ExternalLoginEmailConfirmationPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExternalLoginEmailConfirmationPageRoutingModule {}
