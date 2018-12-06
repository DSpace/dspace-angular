import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { DynamicFormLayoutService, DynamicFormService, DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AuthRequestService } from './auth/auth-request.service';
import { AuthResponseParsingService } from './auth/auth-response-parsing.service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthenticatedGuard } from './auth/authenticated.guard';
import { BrowseService } from './browse/browse.service';
import { RemoteDataBuildService } from './cache/builders/remote-data-build.service';
import { ObjectCacheService } from './cache/object-cache.service';
import { ResponseCacheService } from './cache/response-cache.service';
import { SubmissionDefinitionsConfigService } from './config/submission-definitions-config.service';
import { SubmissionFormsConfigService } from './config/submission-forms-config.service';
import { SubmissionSectionsConfigService } from './config/submission-sections-config.service';
import { coreEffects } from './core.effects';
import { coreReducers } from './core.reducers';
import { BrowseEntriesResponseParsingService } from './data/browse-entries-response-parsing.service';
import { BrowseItemsResponseParsingService } from './data/browse-items-response-parsing-service';
import { BrowseResponseParsingService } from './data/browse-response-parsing.service';
import { CollectionDataService } from './data/collection-data.service';
import { CommunityDataService } from './data/community-data.service';
import { ConfigResponseParsingService } from './data/config-response-parsing.service';
import { DebugResponseParsingService } from './data/debug-response-parsing.service';
import { DSOResponseParsingService } from './data/dso-response-parsing.service';
import { DSpaceObjectDataService } from './data/dspace-object-data.service';
import { EndpointMapResponseParsingService } from './data/endpoint-map-response-parsing.service';
import { FacetConfigResponseParsingService } from './data/facet-config-response-parsing.service';
import { FacetValueMapResponseParsingService } from './data/facet-value-map-response-parsing.service';
import { FacetValueResponseParsingService } from './data/facet-value-response-parsing.service';
import { ItemDataService } from './data/item-data.service';
import { MetadataschemaParsingService } from './data/metadataschema-parsing.service';
import { RegistryBitstreamformatsResponseParsingService } from './data/registry-bitstreamformats-response-parsing.service';
import { RegistryMetadatafieldsResponseParsingService } from './data/registry-metadatafields-response-parsing.service';
import { RegistryMetadataschemasResponseParsingService } from './data/registry-metadataschemas-response-parsing.service';
import { RequestService } from './data/request.service';
import { SearchResponseParsingService } from './data/search-response-parsing.service';
import { DSpaceRESTv2Service } from './dspace-rest-v2/dspace-rest-v2.service';
import { AuthorityService } from './integration/authority.service';
import { IntegrationResponseParsingService } from './integration/integration-response-parsing.service';
import { MetadataService } from './metadata/metadata.service';
import { RegistryService } from './registry/registry.service';
import { HALEndpointService } from './shared/hal-endpoint.service';
import { UUIDService } from './shared/uuid.service';
import { isNotEmpty } from '../shared/empty.util';
import { FormBuilderService } from '../shared/form/builder/form-builder.service';
import { FormService } from '../shared/form/form.service';
import { HostWindowService } from '../shared/host-window.service';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { ApiService } from '../shared/services/api.service';
import { RouteService } from '../shared/services/route.service';
import { ServerResponseService } from '../shared/services/server-response.service';
import { NativeWindowFactory, NativeWindowService } from '../shared/services/window.service';
import { UploaderService } from '../shared/uploader/uploader.service';

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
  AuthenticatedGuard,
  AuthRequestService,
  AuthResponseParsingService,
  CommunityDataService,
  CollectionDataService,
  DSOResponseParsingService,
  DSpaceRESTv2Service,
  DynamicFormLayoutService,
  DynamicFormService,
  DynamicFormValidationService,
  FormBuilderService,
  FormService,
  HALEndpointService,
  HostWindowService,
  ItemDataService,
  MetadataService,
  ObjectCacheService,
  PaginationComponentOptions,
  RegistryService,
  RemoteDataBuildService,
  RequestService,
  ResponseCacheService,
  EndpointMapResponseParsingService,
  FacetValueResponseParsingService,
  FacetValueMapResponseParsingService,
  FacetConfigResponseParsingService,
  RegistryMetadataschemasResponseParsingService,
  RegistryMetadatafieldsResponseParsingService,
  RegistryBitstreamformatsResponseParsingService,
  MetadataschemaParsingService,
  DebugResponseParsingService,
  SearchResponseParsingService,
  ServerResponseService,
  BrowseResponseParsingService,
  BrowseEntriesResponseParsingService,
  BrowseItemsResponseParsingService,
  BrowseService,
  ConfigResponseParsingService,
  RouteService,
  SubmissionDefinitionsConfigService,
  SubmissionFormsConfigService,
  SubmissionSectionsConfigService,
  AuthorityService,
  IntegrationResponseParsingService,
  UploaderService,
  UUIDService,
  DSpaceObjectDataService,
  // register AuthInterceptor as HttpInterceptor
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
  NotificationsService,
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
