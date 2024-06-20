import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ContactPageComponent } from './contact-page.component';
import { ContactPageRoutingModule } from './contact-page-routing.module';
import { ThemedContactPageComponent } from './themed-contact-page.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        ContactPageRoutingModule,
        TranslateModule,
        RouterModule
    ],
  declarations: [
    ContactPageComponent,
    ThemedContactPageComponent
  ]
})
export class ContactPageModule {

}
