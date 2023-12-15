import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TripPlaningComponent } from './trip-planing/trip-planing.component';
import { HomeComponent } from './home/home.component';
import { GeneratingItineraryComponent } from './generating-itinerary/generating-itinerary.component';
import { TripDetailsComponent } from './trip-details/trip-details.component';
import { TripDetailsLoginComponent } from './trip-details-login/trip-details-login.component';
import { BookTicketComponent } from './book-ticket/book-ticket.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { BookingProcessingComponent } from './booking-processing/booking-processing.component';
import { MyTripsComponent } from './my-trips/my-trips.component';
import { FeedsComponent } from './feeds/feeds.component';
import { BudgetPlannerComponent } from './budget-planner/budget-planner.component';
import { CityBudgetDetailsComponent } from './city-budget-details/city-budget-details.component';
import { PendingTripDetailsComponent } from './pending-trip-details/pending-trip-details.component';
import { CancelTripDetailsComponent } from './cancel-trip-details/cancel-trip-details.component';
import { ConfirmTripDetailsComponent } from './confirm-trip-details/confirm-trip-details.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { HelpFaqComponent } from './help-faq/help-faq.component';
import { ChatComponent } from './chat/chat.component';
import { PopularDestinationsComponent } from './popular-destinations/popular-destinations.component';
import { ManuallyTripDetailComponent } from './manually-trip-detail/manually-trip-detail.component';
import { LoginComponent } from './Auth/login/login.component';
import { SignUpComponent } from './Auth/sign-up/sign-up.component';
import { AuthGuard } from './Auth/auth.guard';
import { VerifyCodeComponent } from './Auth/verify-code/verify-code.component';
import { ForgotPasswordComponent } from './Auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Auth/reset-password/reset-password.component';
import { MyProfileComponent } from './my-account/my-profile/my-profile.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'trip-plan', component: TripPlaningComponent, canActivate: [AuthGuard] },
  { path: 'generating-itinerary', component: GeneratingItineraryComponent, canActivate: [AuthGuard] },
  { path: 'trip-details/:id', component: TripDetailsComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'forget-password', component: ForgotPasswordComponent },
  { path: 'signup', component: SignUpComponent },
   { path: 'verify-email/:id', component: VerifyCodeComponent },
  // { path: 'app//verify-email/:id', component: VerifyCodeComponent },
  { path: 'reset-password/:id', component: ResetPasswordComponent },
  // { path: 'app//reset-password/:id', component: ResetPasswordComponent },
  { path: 'trip-details-login', component: TripDetailsLoginComponent, canActivate: [AuthGuard] },
  { path: 'book-ticket', component: BookTicketComponent, canActivate: [AuthGuard] },
  { path: 'booking-details', component: BookingDetailsComponent, canActivate: [AuthGuard] },
  { path: 'booking-processing', component: BookingProcessingComponent, canActivate: [AuthGuard] },
  { path: 'my-trips', component: MyTripsComponent, canActivate: [AuthGuard] },
  { path: 'feeds', component: FeedsComponent, canActivate: [AuthGuard] },
  { path: 'budget-planner', component: BudgetPlannerComponent, canActivate: [AuthGuard] },
  { path: 'city-budget-details', component: CityBudgetDetailsComponent, canActivate: [AuthGuard] },
  { path: 'pending-trip-details', component: PendingTripDetailsComponent, canActivate: [AuthGuard] },
  { path: 'cancel-trip-details', component: CancelTripDetailsComponent, canActivate: [AuthGuard] },
  { path: 'confirm-trip-details', component: ConfirmTripDetailsComponent, canActivate: [AuthGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: 'my-account', component: MyAccountComponent, canActivate: [AuthGuard] },
  { path: 'my-profile', component: MyProfileComponent, canActivate: [AuthGuard] },
  { path: 'terms-&-condition', component: TermsConditionComponent, canActivate: [AuthGuard] },
  { path: 'privacy-policy', component: PrivacyPolicyComponent, canActivate: [AuthGuard] },
  { path: 'invoice', component: InvoiceComponent, canActivate: [AuthGuard] },
  { path: 'help', component: HelpFaqComponent, canActivate: [AuthGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'popular-destinations', component: PopularDestinationsComponent, canActivate: [AuthGuard] },
  { path: 'manually-trip-detail', component: ManuallyTripDetailComponent, canActivate: [AuthGuard] },
  { path: '**', component: HomeComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


