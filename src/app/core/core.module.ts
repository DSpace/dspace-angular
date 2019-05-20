import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DynamicFormLayoutService, DynamicFormService, DynamicFormValidationService } from '@ng-dynamic-forms/core';

import { coreEffects } from './core.effects';
import { coreReducers } from './core.reducers';

import { isNotEmpty } from '../shared/empty.util';

import { ApiService } from '../shared/services/api.service';
import { BrowseEntriesResponseParsingService } from './data/browse-entries-response-parsing.service';
import { CollectionDataService } from './data/collection-data.service';
import { CommunityDataService } from './data/community-data.service';
import { DebugResponseParsingService } from './data/debug-response-parsing.service';
import { DSOResponseParsingService } from './data/dso-response-parsing.service';
import { SearchResponseParsingService } from './data/search-response-parsing.service';
import { DSpaceRESTv2Service } from './dspace-rest-v2/dspace-rest-v2.service';
import { FormBuilderService } from '../shared/form/builder/form-builder.service';
import { SectionFormOperationsService } from '../submission/sections/form/section-form-operations.service';
import { FormService } from '../shared/form/form.service';
import { GroupEpersonService } from './eperson/group-eperson.service';
import { HostWindowService } from '../shared/host-window.service';
import { ItemDataService } from './data/item-data.service';
import { MetadataService } from './metadata/metadata.service';
import { ObjectCacheService } from './cache/object-cache.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { RemoteDataBuildService } from './cache/builders/remote-data-build.service';
import { RequestService } from './data/request.service';
import { EndpointMapResponseParsingService } from './data/endpoint-map-response-parsing.service';
import { ServerResponseService } from '../shared/services/server-response.service';
import { NativeWindowFactory, NativeWindowService } from '../shared/services/window.service';
import { BrowseService } from './browse/browse.service';
import { BrowseResponseParsingService } from './data/browse-response-parsing.service';
import { ConfigResponseParsingService } from './config/config-response-parsing.service';
import { RouteService } from '../shared/services/route.service';
import { SubmissionDefinitionsConfigService } from './config/submission-definitions-config.service';
import { SubmissionFormsConfigService } from './config/submission-forms-config.service';
import { SubmissionSectionsConfigService } from './config/submission-sections-config.service';
import { SubmissionResponseParsingService } from './submission/submission-response-parsing.service';
import { EpersonResponseParsingService } from './eperson/eperson-response-parsing.service';
import { JsonPatchOperationsBuilder } from './json-patch/builder/json-patch-operations-builder';
import { AuthorityService } from './integration/authority.service';
import { IntegrationResponseParsingService } from './integration/integration-response-parsing.service';
import { WorkspaceitemDataService } from './submission/workspaceitem-data.service';
import { UUIDService } from './shared/uuid.service';
import { AuthenticatedGuard } from './auth/authenticated.guard';
import { AuthRequestService } from './auth/auth-request.service';
import { AuthResponseParsingService } from './auth/auth-response-parsing.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { HALEndpointService } from './shared/hal-endpoint.service';
import { FacetValueResponseParsingService } from './data/facet-value-response-parsing.service';
import { FacetValueMapResponseParsingService } from './data/facet-value-map-response-parsing.service';
import { FacetConfigResponseParsingService } from './data/facet-config-response-parsing.service';
import { RegistryService } from './registry/registry.service';
import { RegistryMetadataschemasResponseParsingService } from './data/registry-metadataschemas-response-parsing.service';
import { RegistryMetadatafieldsResponseParsingService } from './data/registry-metadatafields-response-parsing.service';
import { RegistryBitstreamformatsResponseParsingService } from './data/registry-bitstreamformats-response-parsing.service';
import { WorkflowitemDataService } from './submission/workflowitem-data.service';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { UploaderService } from '../shared/uploader/uploader.service';
import { FileService } from './shared/file.service';
import { SubmissionRestService } from './submission/submission-rest.service';
import { BrowseItemsResponseParsingService } from './data/browse-items-response-parsing-service';
import { DSpaceObjectDataService } from './data/dspace-object-data.service';
import { MetadataschemaParsingService } from './data/metadataschema-parsing.service';
import { FilteredDiscoveryPageResponseParsingService } from './data/filtered-discovery-page-response-parsing.service';
import { CSSVariableService } from '../shared/sass-helper/sass-helper.service';
import { MenuService } from '../shared/menu/menu.service';
import { SubmissionJsonPatchOperationsService } from './submission/submission-json-patch-operations.service';
import { NormalizedObjectBuildService } from './cache/builders/normalized-object-build.service';
import { DSOChangeAnalyzer } from './data/dso-change-analyzer.service';
import { ObjectUpdatesService } from './data/object-updates/object-updates.service';
import { DefaultChangeAnalyzer } from './data/default-change-analyzer.service';
import { SearchService } from '../+search-page/search-service/search.service';
import { RelationshipService } from './data/relationship.service';
import { RoleService } from './roles/role.service';
import { MyDSpaceGuard } from '../+my-dspace-page/my-dspace.guard';
import { MyDSpaceResponseParsingService } from './data/mydspace-response-parsing.service';
import { ClaimedTaskDataService } from './tasks/claimed-task-data.service';
import { PoolTaskDataService } from './tasks/pool-task-data.service';
import { TaskResponseParsingService } from './tasks/task-response-parsing.service';

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
  SectionFormOperationsService,
  FormService,
  EpersonResponseParsingService,
  GroupEpersonService,
  HALEndpointService,
  HostWindowService,
  ItemDataService,
  MetadataService,
  ObjectCacheService,
  PaginationComponentOptions,
  RegistryService,
  NormalizedObjectBuildService,
  RemoteDataBuildService,
  RequestService,
  EndpointMapResponseParsingService,
  FacetValueResponseParsingService,
  FacetValueMapResponseParsingService,
  FacetConfigResponseParsingService,
  RegistryMetadataschemasResponseParsingService,
  RegistryMetadatafieldsResponseParsingService,
  RegistryBitstreamformatsResponseParsingService,
  DebugResponseParsingService,
  SearchResponseParsingService,
  MyDSpaceResponseParsingService,
  ServerResponseService,
  BrowseResponseParsingService,
  BrowseEntriesResponseParsingService,
  BrowseItemsResponseParsingService,
  BrowseService,
  ConfigResponseParsingService,
  RouteService,
  SubmissionDefinitionsConfigService,
  SubmissionFormsConfigService,
  SubmissionRestService,
  SubmissionSectionsConfigService,
  SubmissionResponseParsingService,
  SubmissionJsonPatchOperationsService,
  JsonPatchOperationsBuilder,
  AuthorityService,
  IntegrationResponseParsingService,
  MetadataschemaParsingService,
  UploaderService,
  UUIDService,
  NotificationsService,
  WorkspaceitemDataService,
  WorkflowitemDataService,
  UploaderService,
  FileService,
  DSpaceObjectDataService,
  DSOChangeAnalyzer,
  DefaultChangeAnalyzer,
  CSSVariableService,
  MenuService,
  ObjectUpdatesService,
  SearchService,
  RelationshipService,
  MyDSpaceGuard,
  RoleService,
  TaskResponseParsingService,
  ClaimedTaskDataService,
  PoolTaskDataService,
  // register AuthInterceptor as HttpInterceptor
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
  NotificationsService,
  FilteredDiscoveryPageResponseParsingService,
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
