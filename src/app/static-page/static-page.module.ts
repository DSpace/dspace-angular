import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticPageRoutingModule } from './static-page-routing.module';
import { StaticPageComponent } from './static-page.component';


@NgModule({
  declarations: [
    StaticPageComponent
  ],
  imports: [
    CommonModule,
    StaticPageRoutingModule,
  ]
})
export class StaticPageModule { }
