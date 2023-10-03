import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThemedExternalLoginValidationPageComponent } from './themed-external-login-validation-page.component';
import { RegistrationTokenGuard } from '../shared/external-log-in-complete/guards/registration-token.guard';
import { RegistrationDataCreateUserResolver } from './resolvers/registration-data-create-user.resolver';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ThemedExternalLoginValidationPageComponent,
    // canActivate: [RegistrationTokenGuard] // TODO: uncomment this line to enable the guard later
    resolve: { createUser: RegistrationDataCreateUserResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalLoginValidationPageRoutingModule { }
