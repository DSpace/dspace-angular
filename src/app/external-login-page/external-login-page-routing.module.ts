import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';

import { RegistrationTokenGuard } from '../external-log-in/guards/registration-token.guard';
import { RegistrationDataResolver } from '../external-log-in/resolvers/registration-data.resolver';
import { ThemedExternalLoginPageComponent } from './themed-external-login-page.component';

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
  providers: [],
})
export class ExternalLoginPageRoutingModule {}
