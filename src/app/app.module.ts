import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { appReducers } from './app.reducer';
import { appEffects } from './app.effects';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';

import { TransferHttpModule } from '../modules/transfer-http/transfer-http.module';

import { HomeModule } from './home/home.module';
import { ItemPageModule } from './item-page/item-page.module';
import { CollectionPageModule } from './collection-page/collection-page.module';
import { CommunityPageModule } from './community-page/community-page.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';

import { GLOBAL_CONFIG, ENV_CONFIG } from '../config';
import { EffectsModule } from '@ngrx/effects';
import { appMetaReducers } from './app.metareducers';

export function getConfig() {
  return ENV_CONFIG;
}

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    CoreModule.forRoot(),
    HttpModule,
    TransferHttpModule,
    HomeModule,
    ItemPageModule,
    CollectionPageModule,
    CommunityPageModule,
    AppRoutingModule,
    StoreModule.forRoot(appReducers, { metaReducers: appMetaReducers }),
    StoreDevtoolsModule.instrument({ maxAge: 50 }),
    EffectsModule.forRoot(appEffects)
  ],
  providers: [
    { provide: GLOBAL_CONFIG, useFactory: (getConfig) },
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    PageNotFoundComponent,
  ],
  exports: [AppComponent]
})
export class AppModule {

}
