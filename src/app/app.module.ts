import { NgModule } from '@angular/core';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, MetaReducer, META_REDUCERS } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';

import { storeFreeze } from 'ngrx-store-freeze';

import { TranslateModule } from '@ngx-translate/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { appEffects } from './app.effects';
import { appReducers, AppState } from './app.reducer';
import { appMetaReducers, debugMetaReducers } from './app.metareducers';

import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';

import { GLOBAL_CONFIG, ENV_CONFIG, GlobalConfig } from '../config';

import { DSpaceRouterStateSerializer } from './shared/ngrx/dspace-router-state-serializer';
import { UniversalService } from './universal.service';

export function getConfig() {
  return ENV_CONFIG;
}

export function getBase() {
  return ENV_CONFIG.ui.nameSpace;
}

export function getMetaReducers(config: GlobalConfig): Array<MetaReducer<AppState>> {
  const metaReducers: Array<MetaReducer<AppState>> = config.production ? appMetaReducers : [...appMetaReducers, storeFreeze];
  if (config.debug) {
    metaReducers.concat(debugMetaReducers)
  }
  return metaReducers;
}

const DEV_MODULES: any[] = [];

if (!ENV_CONFIG.production) {
  DEV_MODULES.push(StoreDevtoolsModule.instrument({ maxAge: 100 }));
}

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    RouterModule,
    AppRoutingModule,
    CoreModule.forRoot(),
    NgbModule.forRoot(),
    TranslateModule.forRoot(),
    StoreModule.forRoot(appReducers),
    StoreRouterConnectingModule,
    ...DEV_MODULES
  ],
  providers: [
    {
      provide: GLOBAL_CONFIG,
      useFactory: (getConfig)
    },
    {
      provide: APP_BASE_HREF,
      useFactory: (getBase)
    },
    {
      provide: META_REDUCERS,
      useFactory: getMetaReducers,
      deps: [GLOBAL_CONFIG]
    },
    {
      provide: RouterStateSerializer,
      useClass: DSpaceRouterStateSerializer
    },
    UniversalService
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
