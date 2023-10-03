import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExternalLoginReviewAccountInfoPageComponent } from './external-login-review-account-info-page.component';
import { RegistrationDataResolver } from '../shared/external-log-in-complete/resolvers/registration-data.resolver';


const routes: Routes = [
  {
  path: '',
  pathMatch: 'full',
  component: ExternalLoginReviewAccountInfoPageComponent,
  // canActivate: [ReviewAccountGuard],// TODO: Remove comment
  resolve: { registrationData: RegistrationDataResolver }
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalLoginReviewAccountInfoRoutingModule { }
