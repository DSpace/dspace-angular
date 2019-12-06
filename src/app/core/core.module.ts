import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  DynamicFormLayoutService,
  DynamicFormService,
  DynamicFormValidationService
} from '@ng-dynamic-forms/core';

import { coreEffects } from './core.effects';
import { coreReducers } from './core.reducers';

import { isNotEmpty } from '../shared/empty.util';

import { ApiService } from './services/api.service';
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
import { ServerResponseService } from './services/server-response.service';
import { NativeWindowFactory, NativeWindowService } from './services/window.service';
import { BrowseService } from './browse/browse.service';
import { BrowseResponseParsingService } from './data/browse-response-parsing.service';
import { ConfigResponseParsingService } from './config/config-response-parsing.service';
import { RouteService } from './services/route.service';
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
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { HALEndpointService } from './shared/hal-endpoint.service';
import { FacetValueResponseParsingService } from './data/facet-value-response-parsing.service';
import { FacetValueMapResponseParsingService } from './data/facet-value-map-response-parsing.service';
import { FacetConfigResponseParsingService } from './data/facet-config-response-parsing.service';
import { ResourcePolicyService } from './data/resource-policy.service';
import { RegistryService } from './registry/registry.service';
import { RegistryMetadataschemasResponseParsingService } from './data/registry-metadataschemas-response-parsing.service';
import { RegistryMetadatafieldsResponseParsingService } from './data/registry-metadatafields-response-parsing.service';
import { RegistryBitstreamformatsResponseParsingService } from './data/registry-bitstreamformats-response-parsing.service';
import { WorkflowItemDataService } from './submission/workflowitem-data.service';
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
import { SearchService } from './shared/search/search.service';
import { RelationshipService } from './data/relationship.service';
import { NormalizedCollection } from './cache/models/normalized-collection.model';
import { NormalizedCommunity } from './cache/models/normalized-community.model';
import { NormalizedDSpaceObject } from './cache/models/normalized-dspace-object.model';
import { NormalizedBitstream } from './cache/models/normalized-bitstream.model';
import { NormalizedBundle } from './cache/models/normalized-bundle.model';
import { NormalizedBitstreamFormat } from './cache/models/normalized-bitstream-format.model';
import { NormalizedItem } from './cache/models/normalized-item.model';
import { NormalizedEPerson } from './eperson/models/normalized-eperson.model';
import { NormalizedGroup } from './eperson/models/normalized-group.model';
import { NormalizedResourcePolicy } from './cache/models/normalized-resource-policy.model';
import { NormalizedMetadataSchema } from './metadata/normalized-metadata-schema.model';
import { NormalizedMetadataField } from './metadata/normalized-metadata-field.model';
import { NormalizedLicense } from './cache/models/normalized-license.model';
import { NormalizedWorkflowItem } from './submission/models/normalized-workflowitem.model';
import { NormalizedWorkspaceItem } from './submission/models/normalized-workspaceitem.model';
import { NormalizedSubmissionDefinitionsModel } from './config/models/normalized-config-submission-definitions.model';
import { NormalizedSubmissionFormsModel } from './config/models/normalized-config-submission-forms.model';
import { NormalizedSubmissionSectionModel } from './config/models/normalized-config-submission-section.model';
import { NormalizedAuthStatus } from './auth/models/normalized-auth-status.model';
import { NormalizedAuthorityValue } from './integration/models/normalized-authority-value.model';
import { RoleService } from './roles/role.service';
import { MyDSpaceGuard } from '../+my-dspace-page/my-dspace.guard';
import { MyDSpaceResponseParsingService } from './data/mydspace-response-parsing.service';
import { ClaimedTaskDataService } from './tasks/claimed-task-data.service';
import { PoolTaskDataService } from './tasks/pool-task-data.service';
import { TaskResponseParsingService } from './tasks/task-response-parsing.service';
import { BitstreamFormatDataService } from './data/bitstream-format-data.service';
import { NormalizedClaimedTask } from './tasks/models/normalized-claimed-task-object.model';
import { NormalizedTaskObject } from './tasks/models/normalized-task-object.model';
import { NormalizedPoolTask } from './tasks/models/normalized-pool-task-object.model';
import { NormalizedRelationship } from './cache/models/items/normalized-relationship.model';
import { NormalizedRelationshipType } from './cache/models/items/normalized-relationship-type.model';
import { NormalizedItemType } from './cache/models/items/normalized-item-type.model';
import { MetadatafieldParsingService } from './data/metadatafield-parsing.service';
import { NormalizedSubmissionUploadsModel } from './config/models/normalized-config-submission-uploads.model';
import { NormalizedBrowseEntry } from './shared/normalized-browse-entry.model';
import { BrowseDefinition } from './shared/browse-definition.model';
import { MappedCollectionsReponseParsingService } from './data/mapped-collections-reponse-parsing.service';
import { ObjectSelectService } from '../shared/object-select/object-select.service';
import { SiteDataService } from './data/site-data.service';
import { NormalizedSite } from './cache/models/normalized-site.model';

import {
  MOCK_RESPONSE_MAP,
  MockResponseMap,
  mockResponseMap
} from './dspace-rest-v2/mocks/mock-response-map';
import { EndpointMockingRestService } from './dspace-rest-v2/endpoint-mocking-rest.service';
import { ENV_CONFIG, GLOBAL_CONFIG, GlobalConfig } from '../../config';
import { SearchFilterService } from './shared/search/search-filter.service';
import { SearchConfigurationService } from './shared/search/search-configuration.service';
import { SelectableListService } from '../shared/object-list/selectable-list/selectable-list.service';
import { RelationshipTypeService } from './data/relationship-type.service';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { NormalizedExternalSource } from './cache/models/normalized-external-source.model';
import { NormalizedExternalSourceEntry } from './cache/models/normalized-external-source-entry.model';
import { ExternalSourceService } from './data/external-source.service';
import { LookupRelationService } from './data/lookup-relation.service';

export const restServiceFactory = (cfg: GlobalConfig, mocks: MockResponseMap, http: HttpClient) => {
  if (ENV_CONFIG.production) {
    return new DSpaceRESTv2Service(http);
  } else {
    return new EndpointMockingRestService(cfg, mocks, http);
  }
};

const IMPORTS = [
  CommonModule,
  StoreModule.forFeature('core', coreReducers, {}),
  EffectsModule.forFeature(coreEffects)
];

const DECLARATIONS = [];

const EXPORTS = [];

const PROVIDERS = [
  ApiService,
  AuthenticatedGuard,
  AuthRequestService,
  AuthResponseParsingService,
  CommunityDataService,
  CollectionDataService,
  SiteDataService,
  DSOResponseParsingService,
  { provide: MOCK_RESPONSE_MAP, useValue: mockResponseMap },
  { provide: DSpaceRESTv2Service, useFactory: restServiceFactory, deps: [GLOBAL_CONFIG, MOCK_RESPONSE_MAP, HttpClient]},
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
  ResourcePolicyService,
  RegistryService,
  BitstreamFormatDataService,
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
  MappedCollectionsReponseParsingService,
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
  MetadatafieldParsingService,
  UploaderService,
  UUIDService,
  NotificationsService,
  WorkspaceitemDataService,
  WorkflowItemDataService,
  UploaderService,
  FileService,
  DSpaceObjectDataService,
  DSOChangeAnalyzer,
  DefaultChangeAnalyzer,
  ObjectSelectService,
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
  SearchService,
  SidebarService,
  SearchFilterService,
  SearchFilterService,
  SearchConfigurationService,
  SelectableListService,
  RelationshipTypeService,
  ExternalSourceService,
  LookupRelationService,
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

/**
 * Declaration needed to make sure all decorator functions are called in time
 */
export const normalizedModels =
  [
    NormalizedDSpaceObject,
    NormalizedBundle,
    NormalizedBitstream,
    NormalizedBitstreamFormat,
    NormalizedItem,
    NormalizedSite,
    NormalizedCollection,
    NormalizedCommunity,
    NormalizedEPerson,
    NormalizedGroup,
    NormalizedResourcePolicy,
    NormalizedMetadataSchema,
    NormalizedMetadataField,
    NormalizedLicense,
    NormalizedWorkflowItem,
    NormalizedWorkspaceItem,
    NormalizedSubmissionDefinitionsModel,
    NormalizedSubmissionFormsModel,
    NormalizedSubmissionSectionModel,
    NormalizedSubmissionUploadsModel,
    NormalizedAuthStatus,
    NormalizedAuthorityValue,
    NormalizedBrowseEntry,
    BrowseDefinition,
    NormalizedClaimedTask,
    NormalizedTaskObject,
    NormalizedPoolTask,
    NormalizedRelationship,
    NormalizedRelationshipType,
    NormalizedItemType,
    NormalizedExternalSource,
    NormalizedExternalSourceEntry
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

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (isNotEmpty(parentModule)) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
