import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LogoutPageComponent } from './logout-page.component';
import { LogoutPageRoutingModule } from './logout-page-routing.module';
import { ThemedLogoutPageComponent } from './themed-logout-page.component';

@NgModule({
    imports: [
        LogoutPageRoutingModule,
        CommonModule,
        LogoutPageComponent,
        ThemedLogoutPageComponent
    ]
})
export class LogoutPageModule {

}
