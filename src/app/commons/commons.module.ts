import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatError, MatFormField, MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import { AnimationLoaderComponent } from './components/animation-loader/animation-loader.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatTab, MatTabGroup, MatTabLabel, MatTabsModule } from '@angular/material/tabs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MainNavComponent } from './main-nav/main-nav.component';
import {MatTableModule} from '@angular/material/table';
import { AlertComponent } from './components/alert/alert.component';

import { GooglePlacesSearchComponent } from './google-places-search/google-places-search.component';
// Note we need a separate function as it's required
// by the AOT compiler.
export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AnimationLoaderComponent,
    MainNavComponent,
    GooglePlacesSearchComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatDatepickerModule,
    HttpClientModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatNativeDateModule,
    MatMenuModule,
    MatCheckboxModule,
    MatStepperModule,
    MatDialogModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    FlexLayoutModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    LottieModule.forRoot({ player: playerFactory }),
    MatTableModule,
   
  ],
  exports:[
    CommonModule,
    MatCardModule,
    MatDatepickerModule,
    HttpClientModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatCheckboxModule,
    MatStepperModule,
    MatDialogModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    FlexLayoutModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatExpansionPanelTitle,
    MatTabGroup,
    MatTab,
    MatTabLabel,
    MatFormField,
    MatLabel,
    MatHint,
    MatError,
    AnimationLoaderComponent,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MainNavComponent,
    MatTableModule,
    GooglePlacesSearchComponent
  ]
})
export class CommonsModule { }
