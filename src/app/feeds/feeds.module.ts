import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedsComponent } from './feeds.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonsModule } from '../commons/commons.module';
import { SwiperModule } from 'swiper/angular';
import { LottieModule } from 'ngx-lottie';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSliderModule } from '@angular/material/slider';
import { DragDropModule } from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    CommonsModule,
    SwiperModule,
    LottieModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSliderModule,
    DragDropModule,
  ]
})
export class FeedsModule { }
