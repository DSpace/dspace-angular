import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { StoreModule, Store } from '@ngrx/store';
import { RouterStoreModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { rootReducer, AppState } from './app.reducer';
import { effects } from './app.effects';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';

import { TransferHttpModule } from '../modules/transfer-http/transfer-http.module';

import { HomeModule } from './home/home.module';
import { ItemPageModule } from './item-page/item-page.module';
import { CollectionPageModule } from './collection-page/collection-page.module';
import { CommunityPageModule } from './community-page/community-page.module';
import { SubmissionModule } from './submission/submission.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';

import { GLOBAL_CONFIG, ENV_CONFIG } from '../config';

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
    SubmissionModule,
    AppRoutingModule,
    StoreModule.provideStore(rootReducer),
    RouterStoreModule.connectRouter(),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    effects
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
