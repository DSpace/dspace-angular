import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThemedExternalLoginPageComponent } from './themed-external-login-page.component';
import { RegistrationTokenGuard } from '../shared/external-log-in-complete/guards/registration-token.guard';
import { RegistrationDataResolver } from '../shared/external-log-in-complete/resolvers/registration-data.resolver';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ThemedExternalLoginPageComponent,
    canActivate: [RegistrationTokenGuard],
    resolve: { registrationData: RegistrationDataResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ExternalLoginPageRoutingModule { }
