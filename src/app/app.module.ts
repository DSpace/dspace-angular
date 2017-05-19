import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';

import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageNotFoundComponent
  ],
  imports: [
    SharedModule,
    HomeModule,
    CoreModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
  ]
})
export class AppModule {
}

export { AppComponent } from './app.component';
