import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [
    CommonModule, // we use ngFor
    SharedModule
  ],
  exports: [FooterComponent],
  declarations: [FooterComponent],
  providers: []
})

export class CoreModule { }
