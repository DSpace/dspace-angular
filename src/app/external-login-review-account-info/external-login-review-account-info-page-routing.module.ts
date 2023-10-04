import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExternalLoginReviewAccountInfoPageComponent } from './external-login-review-account-info-page.component';
import { RegistrationDataResolver } from '../shared/external-log-in-complete/resolvers/registration-data.resolver';
import { ReviewAccountGuard } from './helpers/review-account.guard';


const routes: Routes = [
  {
  path: '',
  pathMatch: 'full',
  component: ExternalLoginReviewAccountInfoPageComponent,
  canActivate: [ReviewAccountGuard],
  resolve: { registrationData: RegistrationDataResolver }
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalLoginReviewAccountInfoRoutingModule { }
