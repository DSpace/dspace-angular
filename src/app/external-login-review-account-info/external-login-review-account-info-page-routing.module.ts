import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExternalLoginReviewAccountInfoPageComponent } from './external-login-review-account-info-page.component';

const routes: Routes = [
  {
  path: '',
  pathMatch: 'full',
  component: ExternalLoginReviewAccountInfoPageComponent,
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalLoginReviewAccountInfoRoutingModule { }
