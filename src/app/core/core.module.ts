import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../shared/shared.module";
import { isNotEmpty } from "../shared/empty.util";
import { FooterComponent } from "./footer/footer.component";
import { DSpaceRESTv2Service } from "./dspace-rest-v2/dspace-rest-v2.service";
import { ObjectCacheService } from "./cache/object-cache.service";
import { CollectionDataService } from "./data-services/collection-data.service";
import { ItemDataService } from "./data-services/item-data.service";

const IMPORTS = [
  CommonModule,
  SharedModule
];

const DECLARATIONS = [
  FooterComponent
];

const EXPORTS = [
  FooterComponent
];

const PROVIDERS = [
  CollectionDataService,
  ItemDataService,
  DSpaceRESTv2Service,
  ObjectCacheService
];

@NgModule({
  imports: [ ...IMPORTS ],
  declarations: [...DECLARATIONS],
  exports: [...EXPORTS],
  providers: [...PROVIDERS]
})
export class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (isNotEmpty(parentModule)) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        ...PROVIDERS
      ]
    };
  }
}
