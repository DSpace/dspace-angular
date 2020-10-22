import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuggestionPageComponent } from './suggestion-page.component';
import { SharedModule } from '../shared/shared.module';
import { SuggestionPageRoutingModule } from './suggestion-page-routing.module';


@NgModule({
  declarations: [SuggestionPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    SuggestionPageRoutingModule
  ]
})
export class SuggestionPageModule { }
