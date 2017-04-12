import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { CommonModule } from "@angular/common";

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule { }
