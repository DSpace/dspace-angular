import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonsModule } from './commons/commons.module';
import { LottieModule } from 'ngx-lottie';
import { HomeComponent } from './home/home.component';
import { MainNavComponent } from './commons/main-nav/main-nav.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCommonModule } from '@angular/material/core';
import { TripPlaningComponent } from './trip-planing/trip-planing.component';
import { GeneratingItineraryComponent } from './generating-itinerary/generating-itinerary.component';
import { TripDetailsComponent } from './trip-details/trip-details.component';
import { TripDetailsLoginComponent } from './trip-details-login/trip-details-login.component';
import { BookTicketComponent } from './book-ticket/book-ticket.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { BookingProcessingComponent } from './booking-processing/booking-processing.component';
import { MyTripsComponent } from './my-trips/my-trips.component';
import { FeedsComponent } from './feeds/feeds.component';
import { JoinTripDailogComponent } from './join-trip-dailog/join-trip-dailog.component';
import { BudgetPlannerComponent } from './budget-planner/budget-planner.component';
import { CityBudgetDetailsComponent } from './city-budget-details/city-budget-details.component';
import { SwiperModule } from 'swiper/angular';
import { PendingTripDetailsComponent } from './pending-trip-details/pending-trip-details.component';
import { CancelTripDailogComponent } from './cancel-trip-dailog/cancel-trip-dailog.component';
import { CancelTripDetailsComponent } from './cancel-trip-details/cancel-trip-details.component';
import { ConfirmTripDetailsComponent } from './confirm-trip-details/confirm-trip-details.component';
import { ReplacePlaceDialogComponent } from './replace-place-dialog/replace-place-dialog.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { DiscoverPlaceComponent } from './home/discover-place/discover-place.component';
import { SeasonComponent } from './home/season/season.component';
import { TripComponent } from './home/trip/trip.component';
import { DestinationComponent } from './home/destination/destination.component';
import { FooterComponent } from './home/footer/footer.component';
import { SearchModalComponent } from './home/search-modal/search-modal.component';

import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { FlightDialogComponent } from './flight-dialog/flight-dialog.component';
import { HotelDialogComponent } from './hotel-dialog/hotel-dialog.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { HelpFaqComponent } from './help-faq/help-faq.component';
import { ChatComponent } from './chat/chat.component';
import { PopularDestinationsComponent } from './popular-destinations/popular-destinations.component';
import { ManuallyTripDetailComponent } from './manually-trip-detail/manually-trip-detail.component';
import player from 'lottie-web';
import { AddCardDialogComponent } from './add-card-dialog/add-card-dialog.component';
import { TripRequestDialogComponent } from './trip-request-dialog/trip-request-dialog.component';
import { ShareDialogComponent } from './share-dialog/share-dialog.component';
import { BudgetTripDetailsComponent } from './budget-trip-details/budget-trip-details.component';
import { DestinationsTripsComponent } from './destinations-trips/destinations-trips.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './Auth/login/login.component';
import { SignUpComponent } from './Auth/sign-up/sign-up.component';
import { VerifyCodeComponent } from './Auth/verify-code/verify-code.component';
import {
  FacebookLoginProvider,
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';
import { ForgotPasswordComponent } from './Auth/forgot-password/forgot-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './Auth/reset-password/reset-password.component';
import { MyProfileComponent } from './my-account/my-profile/my-profile.component';
import { MyUpcomingTripsComponent } from './my-account/my-upcoming-trips/my-upcoming-trips.component';
import { MyBookedTripsComponent } from './my-account/my-booked-trips/my-booked-trips.component';
import { MyCompanionsComponent } from './my-account/my-companions/my-companions.component';
import { PaymentDetailsComponent } from './my-account/payment-details/payment-details.component';
import { MyFavouritesTripComponent } from './my-account/my-favourites-trip/my-favourites-trip.component';
import { SettingsComponent } from './my-account/settings/settings.component';
import { TripHeaderComponent } from './trip-planing/trip-header/trip-header.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { GoogleMapsModule } from '@angular/google-maps';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TripPlaningComponent,
    GeneratingItineraryComponent,
    TripDetailsComponent,
    LoginComponent,
    ForgotPasswordComponent,
    SignUpComponent,
    TripDetailsLoginComponent,
    BookTicketComponent,
    BookingDetailsComponent,
    BookingProcessingComponent,
    MyTripsComponent,
    FeedsComponent,
    JoinTripDailogComponent,
    BudgetPlannerComponent,
    CityBudgetDetailsComponent,
    PendingTripDetailsComponent,
    CancelTripDailogComponent,
    CancelTripDetailsComponent,
    ConfirmTripDetailsComponent,
    ReplacePlaceDialogComponent,
    NotificationsComponent,
    MyAccountComponent,
    DiscoverPlaceComponent,
    SeasonComponent,
    TripComponent,
    DestinationComponent,
    FooterComponent,
    SearchModalComponent,
    MyProfileComponent,
    MyUpcomingTripsComponent,
    MyBookedTripsComponent,
    MyCompanionsComponent,
    PaymentDetailsComponent,
    MyFavouritesTripComponent,
    SettingsComponent,
    TermsConditionComponent,
    PrivacyPolicyComponent,
    FlightDialogComponent,
    HotelDialogComponent,
    InvoiceComponent,
    HelpFaqComponent,
    ChatComponent,
    PopularDestinationsComponent,
    ManuallyTripDetailComponent,
    AddCardDialogComponent,
    TripRequestDialogComponent,
    ShareDialogComponent,
    BudgetTripDetailsComponent,
    DestinationsTripsComponent,
    ProfileComponent,
    VerifyCodeComponent,
    ResetPasswordComponent,
    TripHeaderComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    CommonsModule,
    SwiperModule,
    LottieModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSliderModule,
    DragDropModule,
    GoogleMapsModule,
    InfiniteScrollModule
  ],
  providers: [CommonsModule,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              'clientId'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('3672583036291603'),
          },
        ],
      } as SocialAuthServiceConfig,
    },],
  bootstrap: [AppComponent]
})

export class AppModule { }
