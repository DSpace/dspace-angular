import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { TranslateModule } from '@ngx-translate/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { appReducers } from './app.reducer';
import { appEffects } from './app.effects';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';

import { TransferHttpModule } from '../modules/transfer-http/transfer-http.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';

import { GLOBAL_CONFIG, ENV_CONFIG } from '../config';
import { EffectsModule } from '@ngrx/effects';
import { appMetaReducers } from './app.metareducers';

export function getConfig() {
  return ENV_CONFIG;
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule,
    AppRoutingModule,
    TransferHttpModule,
    CoreModule.forRoot(),
    NgbModule.forRoot(),
    TranslateModule.forRoot(),
    EffectsModule.forRoot(appEffects),
    StoreModule.forRoot(appReducers, { metaReducers: appMetaReducers }),
    StoreDevtoolsModule.instrument({ maxAge: 50 })
  ],
  providers: [
    { provide: GLOBAL_CONFIG, useFactory: (getConfig) }
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent
  ],
  exports: [AppComponent]
})
export class AppModule {

}
