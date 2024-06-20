import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticPageRoutingModule } from './static-page-routing.module';
import { StaticPageComponent } from './static-page.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    StaticPageComponent
  ],
    imports: [
        CommonModule,
        StaticPageRoutingModule,
        SharedModule,
    ]
})
export class StaticPageModule { }
