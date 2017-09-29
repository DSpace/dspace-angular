import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { isNotEmpty } from '../shared/empty.util';
import { DSpaceRESTv2Service } from './dspace-rest-v2/dspace-rest-v2.service';
import { ObjectCacheService } from './cache/object-cache.service';
import { ResponseCacheService } from './cache/response-cache.service';
import { CollectionDataService } from './data/collection-data.service';
import { ItemDataService } from './data/item-data.service';
import { RequestService } from './data/request.service';
import { RemoteDataBuildService } from './cache/builders/remote-data-build.service';
import { CommunityDataService } from './data/community-data.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { coreEffects } from './core.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { coreReducers } from './core.reducers';
import { DSOResponseParsingService } from './data/dso-response-parsing.service';
import { RootResponseParsingService } from './data/root-response-parsing.service';

import { ApiService } from '../shared/api.service';

import { HostWindowService } from '../shared/host-window.service';
import { NativeWindowFactory, NativeWindowService } from '../shared/window.service';

import { ServerResponseService } from '../shared/server-response.service';

const IMPORTS = [
  CommonModule,
  StoreModule.forFeature('core', coreReducers, {}),
  EffectsModule.forFeature(coreEffects)
];

const DECLARATIONS = [

];

const EXPORTS = [

];

const PROVIDERS = [
  ApiService,
  CommunityDataService,
  CollectionDataService,
  DSOResponseParsingService,
  DSpaceRESTv2Service,
  HostWindowService,
  ItemDataService,
  ObjectCacheService,
  PaginationComponentOptions,  
  RemoteDataBuildService,
  RequestService,
  ResponseCacheService,
  RootResponseParsingService,
  ServerResponseService,
  { provide: NativeWindowService, useFactory: NativeWindowFactory }
];

@NgModule({
  imports: [
    ...IMPORTS
  ],
  declarations: [
    ...DECLARATIONS
  ],
  exports: [
    ...EXPORTS
  ],
  providers: [
    ...PROVIDERS
  ]
})
export class CoreModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        ...PROVIDERS
      ]
    };
  }

  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    if (isNotEmpty(parentModule)) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }

}
