import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoginPageComponent } from './login-page.component';
import { LoginPageRoutingModule } from './login-page-routing.module';
import { ThemedLoginPageComponent } from './themed-login-page.component';

@NgModule({
    imports: [
        LoginPageRoutingModule,
        CommonModule,
        LoginPageComponent,
        ThemedLoginPageComponent
    ]
})
export class LoginPageModule {

}
