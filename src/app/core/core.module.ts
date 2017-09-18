import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { isNotEmpty } from '../shared/empty.util';
import { FooterComponent } from './footer/footer.component';
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

const IMPORTS = [
  CommonModule,
  SharedModule,
  StoreModule.forFeature('core', coreReducers, { }),
  EffectsModule.forFeature(coreEffects)
];

const DECLARATIONS = [
  FooterComponent
];

const EXPORTS = [
  FooterComponent
];

const PROVIDERS = [
  CommunityDataService,
  CollectionDataService,
  ItemDataService,
  DSpaceRESTv2Service,
  ObjectCacheService,
  PaginationComponentOptions,
  ResponseCacheService,
  RequestService,
  RemoteDataBuildService
];

@NgModule({
  imports: [...IMPORTS],
  declarations: [...DECLARATIONS],
  exports: [...EXPORTS],
  providers: [...PROVIDERS]
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
