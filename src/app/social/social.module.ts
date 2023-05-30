import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocialComponent } from './social.component';

@NgModule({
  declarations: [
    SocialComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SocialComponent
  ]
})
export class SocialModule { }
