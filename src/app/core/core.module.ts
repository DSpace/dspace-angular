import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { DynamicFormLayoutService, DynamicFormService, DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { EffectsModule } from '@ngrx/effects';

import { Action, StoreConfig, StoreModule } from '@ngrx/store';
import { MyDSpaceGuard } from '../+my-dspace-page/my-dspace.guard';

import { isNotEmpty } from '../shared/empty.util';
import { FormBuilderService } from '../shared/form/builder/form-builder.service';
import { FormService } from '../shared/form/form.service';
import { HostWindowService } from '../shared/host-window.service';
import { MenuService } from '../shared/menu/menu.service';
import { EndpointMockingRestService } from '../shared/mocks/dspace-rest-v2/endpoint-mocking-rest.service';
import {
  MOCK_RESPONSE_MAP,
  mockResponseMap,
  ResponseMapMock
} from '../shared/mocks/dspace-rest-v2/mocks/response-map.mock';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { SelectableListService } from '../shared/object-list/selectable-list/selectable-list.service';
import { ObjectSelectService } from '../shared/object-select/object-select.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { CSSVariableService } from '../shared/sass-helper/sass-helper.service';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { UploaderService } from '../shared/uploader/uploader.service';
import { SectionFormOperationsService } from '../submission/sections/form/section-form-operations.service';
import { AuthRequestService } from './auth/auth-request.service';
import { AuthResponseParsingService } from './auth/auth-response-parsing.service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthenticatedGuard } from './auth/authenticated.guard';
import { AuthStatus } from './auth/models/auth-status.model';
import { BrowseService } from './browse/browse.service';
import { RemoteDataBuildService } from './cache/builders/remote-data-build.service';
import { ObjectCacheService } from './cache/object-cache.service';
import { ConfigResponseParsingService } from './config/config-response-parsing.service';
import { SubmissionDefinitionsModel } from './config/models/config-submission-definitions.model';
import { SubmissionFormsModel } from './config/models/config-submission-forms.model';
import { SubmissionSectionModel } from './config/models/config-submission-section.model';
import { SubmissionUploadsModel } from './config/models/config-submission-uploads.model';
import { SubmissionDefinitionsConfigService } from './config/submission-definitions-config.service';
import { SubmissionFormsConfigService } from './config/submission-forms-config.service';
import { SubmissionSectionsConfigService } from './config/submission-sections-config.service';
import { coreEffects } from './core.effects';
import { coreReducers, CoreState } from './core.reducers';
import { BitstreamFormatDataService } from './data/bitstream-format-data.service';
import { BrowseEntriesResponseParsingService } from './data/browse-entries-response-parsing.service';
import { BrowseItemsResponseParsingService } from './data/browse-items-response-parsing-service';
import { BrowseResponseParsingService } from './data/browse-response-parsing.service';
import { CollectionDataService } from './data/collection-data.service';
import { CommunityDataService } from './data/community-data.service';
import { ContentSourceResponseParsingService } from './data/content-source-response-parsing.service';
import { DebugResponseParsingService } from './data/debug-response-parsing.service';
import { DefaultChangeAnalyzer } from './data/default-change-analyzer.service';
import { DSOChangeAnalyzer } from './data/dso-change-analyzer.service';
import { DSOResponseParsingService } from './data/dso-response-parsing.service';
import { DSpaceObjectDataService } from './data/dspace-object-data.service';
import { EndpointMapResponseParsingService } from './data/endpoint-map-response-parsing.service';
import { ItemTypeDataService } from './data/entity-type-data.service';
import { EntityTypeService } from './data/entity-type.service';
import { ExternalSourceService } from './data/external-source.service';
import { FacetConfigResponseParsingService } from './data/facet-config-response-parsing.service';
import { FacetValueMapResponseParsingService } from './data/facet-value-map-response-parsing.service';
import { FacetValueResponseParsingService } from './data/facet-value-response-parsing.service';
import { FilteredDiscoveryPageResponseParsingService } from './data/filtered-discovery-page-response-parsing.service';
import { ItemDataService } from './data/item-data.service';
import { LicenseDataService } from './data/license-data.service';
import { LookupRelationService } from './data/lookup-relation.service';
import { MappedCollectionsReponseParsingService } from './data/mapped-collections-reponse-parsing.service';
import { MyDSpaceResponseParsingService } from './data/mydspace-response-parsing.service';
import { ObjectUpdatesService } from './data/object-updates/object-updates.service';
import { RelationshipTypeService } from './data/relationship-type.service';
import { RelationshipService } from './data/relationship.service';
import { ResourcePolicyService } from './resource-policy/resource-policy.service';
import { SearchResponseParsingService } from './data/search-response-parsing.service';
import { SiteDataService } from './data/site-data.service';
import { DSpaceRESTv2Service } from './dspace-rest-v2/dspace-rest-v2.service';
import { EPersonDataService } from './eperson/eperson-data.service';
import { EpersonResponseParsingService } from './eperson/eperson-response-parsing.service';
import { EPerson } from './eperson/models/eperson.model';
import { Group } from './eperson/models/group.model';
import { JsonPatchOperationsBuilder } from './json-patch/builder/json-patch-operations-builder';
import { MetadataField } from './metadata/metadata-field.model';
import { MetadataSchema } from './metadata/metadata-schema.model';
import { MetadataService } from './metadata/metadata.service';
import { RegistryService } from './registry/registry.service';
import { RoleService } from './roles/role.service';

import { ApiService } from './services/api.service';
import { ServerResponseService } from './services/server-response.service';
import { NativeWindowFactory, NativeWindowService } from './services/window.service';
import { BitstreamFormat } from './shared/bitstream-format.model';
import { Bitstream } from './shared/bitstream.model';
import { BrowseDefinition } from './shared/browse-definition.model';
import { BrowseEntry } from './shared/browse-entry.model';
import { Bundle } from './shared/bundle.model';
import { Collection } from './shared/collection.model';
import { Community } from './shared/community.model';
import { DSpaceObject } from './shared/dspace-object.model';
import { ExternalSourceEntry } from './shared/external-source-entry.model';
import { ExternalSource } from './shared/external-source.model';
import { FileService } from './shared/file.service';
import { HALEndpointService } from './shared/hal-endpoint.service';
import { ItemType } from './shared/item-relationships/item-type.model';
import { RelationshipType } from './shared/item-relationships/relationship-type.model';
import { Relationship } from './shared/item-relationships/relationship.model';
import { Item } from './shared/item.model';
import { License } from './shared/license.model';
import { ResourcePolicy } from './resource-policy/models/resource-policy.model';
import { SearchConfigurationService } from './shared/search/search-configuration.service';
import { SearchFilterService } from './shared/search/search-filter.service';
import { SearchService } from './shared/search/search.service';
import { Site } from './shared/site.model';
import { UUIDService } from './shared/uuid.service';
import { WorkflowItem } from './submission/models/workflowitem.model';
import { WorkspaceItem } from './submission/models/workspaceitem.model';
import { SubmissionJsonPatchOperationsService } from './submission/submission-json-patch-operations.service';
import { SubmissionResponseParsingService } from './submission/submission-response-parsing.service';
import { SubmissionRestService } from './submission/submission-rest.service';
import { WorkflowItemDataService } from './submission/workflowitem-data.service';
import { WorkspaceitemDataService } from './submission/workspaceitem-data.service';
import { ClaimedTaskDataService } from './tasks/claimed-task-data.service';
import { ClaimedTask } from './tasks/models/claimed-task-object.model';
import { PoolTask } from './tasks/models/pool-task-object.model';
import { TaskObject } from './tasks/models/task-object.model';
import { PoolTaskDataService } from './tasks/pool-task-data.service';
import { TaskResponseParsingService } from './tasks/task-response-parsing.service';
import { ArrayMoveChangeAnalyzer } from './data/array-move-change-analyzer.service';
import { BitstreamDataService } from './data/bitstream-data.service';
import { environment } from '../../environments/environment';
import { storeModuleConfig } from '../app.reducer';
import { VersionDataService } from './data/version-data.service';
import { VersionHistoryDataService } from './data/version-history-data.service';
import { Version } from './shared/version.model';
import { VersionHistory } from './shared/version-history.model';
import { Script } from '../process-page/scripts/script.model';
import { Process } from '../process-page/processes/process.model';
import { ProcessDataService } from './data/processes/process-data.service';
import { ScriptDataService } from './data/processes/script-data.service';
import { ProcessFilesResponseParsingService } from './data/process-files-response-parsing.service';
import { WorkflowActionDataService } from './data/workflow-action-data.service';
import { WorkflowAction } from './tasks/models/workflow-action-object.model';
import { LocaleInterceptor } from './locale/locale.interceptor';
import { ItemTemplateDataService } from './data/item-template-data.service';
import { TemplateItem } from './shared/template-item.model';
import { Feature } from './shared/feature.model';
import { Authorization } from './shared/authorization.model';
import { FeatureDataService } from './data/feature-authorization/feature-data.service';
import { AuthorizationDataService } from './data/feature-authorization/authorization-data.service';
import { SiteAdministratorGuard } from './data/feature-authorization/feature-authorization-guard/site-administrator.guard';
import { Registration } from './shared/registration.model';
import { MetadataSchemaDataService } from './data/metadata-schema-data.service';
import { MetadataFieldDataService } from './data/metadata-field-data.service';
import { TokenResponseParsingService } from './auth/token-response-parsing.service';
import { SubmissionCcLicenseDataService } from './submission/submission-cc-license-data.service';
import { SubmissionCcLicence } from './submission/models/submission-cc-license.model';
import { SubmissionCcLicenceUrl } from './submission/models/submission-cc-license-url.model';
import { SubmissionCcLicenseUrlDataService } from './submission/submission-cc-license-url-data.service';
import { VocabularyEntry } from './submission/vocabularies/models/vocabulary-entry.model';
import { Vocabulary } from './submission/vocabularies/models/vocabulary.model';
import { VocabularyEntriesResponseParsingService } from './submission/vocabularies/vocabulary-entries-response-parsing.service';
import { VocabularyEntryDetail } from './submission/vocabularies/models/vocabulary-entry-detail.model';
import { VocabularyService } from './submission/vocabularies/vocabulary.service';
import { VocabularyTreeviewService } from '../shared/vocabulary-treeview/vocabulary-treeview.service';
import { ConfigurationDataService } from './data/configuration-data.service';
import { ConfigurationProperty } from './shared/configuration-property.model';
import { ReloadGuard } from './reload/reload.guard';
import { EndUserAgreementCurrentUserGuard } from './end-user-agreement/end-user-agreement-current-user.guard';
import { EndUserAgreementCookieGuard } from './end-user-agreement/end-user-agreement-cookie.guard';
import { EndUserAgreementService } from './end-user-agreement/end-user-agreement.service';
import { SiteRegisterGuard } from './data/feature-authorization/feature-authorization-guard/site-register.guard';
import { UsageReport } from './statistics/models/usage-report.model';
import { DSpaceHeaderInterceptor } from './dspace-header/dspace-header.interceptor';

/**
 * When not in production, endpoint responses can be mocked for testing purposes
 * If there is no mock version available for the endpoint, the actual REST response will be used just like in production mode
 */
export const restServiceFactory = (mocks: ResponseMapMock, http: HttpClient) => {
  if (environment.production) {
    return new DSpaceRESTv2Service(http);
  } else {
    return new EndpointMockingRestService(mocks, http);
  }
};

const IMPORTS = [
  CommonModule,
  StoreModule.forFeature('core', coreReducers, storeModuleConfig as StoreConfig<CoreState, Action>),
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
  { provide: DSpaceRESTv2Service, useFactory: restServiceFactory, deps: [MOCK_RESPONSE_MAP, HttpClient] },
  DynamicFormLayoutService,
  DynamicFormService,
  DynamicFormValidationService,
  FormBuilderService,
  SectionFormOperationsService,
  FormService,
  EpersonResponseParsingService,
  EPersonDataService,
  HALEndpointService,
  HostWindowService,
  ItemDataService,
  MetadataService,
  ObjectCacheService,
  PaginationComponentOptions,
  ResourcePolicyService,
  RegistryService,
  BitstreamFormatDataService,
  RemoteDataBuildService,
  EndpointMapResponseParsingService,
  FacetValueResponseParsingService,
  FacetValueMapResponseParsingService,
  FacetConfigResponseParsingService,
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
  SubmissionCcLicenseDataService,
  SubmissionCcLicenseUrlDataService,
  SubmissionDefinitionsConfigService,
  SubmissionFormsConfigService,
  SubmissionRestService,
  SubmissionSectionsConfigService,
  SubmissionResponseParsingService,
  SubmissionJsonPatchOperationsService,
  JsonPatchOperationsBuilder,
  UploaderService,
  UUIDService,
  NotificationsService,
  WorkspaceitemDataService,
  WorkflowItemDataService,
  UploaderService,
  FileService,
  DSpaceObjectDataService,
  ConfigurationDataService,
  DSOChangeAnalyzer,
  DefaultChangeAnalyzer,
  ArrayMoveChangeAnalyzer,
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
  BitstreamDataService,
  EntityTypeService,
  ContentSourceResponseParsingService,
  ItemTemplateDataService,
  SearchService,
  SidebarService,
  SearchFilterService,
  SearchFilterService,
  SearchConfigurationService,
  SelectableListService,
  RelationshipTypeService,
  ExternalSourceService,
  LookupRelationService,
  VersionDataService,
  VersionHistoryDataService,
  LicenseDataService,
  ItemTypeDataService,
  WorkflowActionDataService,
  ProcessDataService,
  ScriptDataService,
  ProcessFilesResponseParsingService,
  FeatureDataService,
  AuthorizationDataService,
  SiteAdministratorGuard,
  SiteRegisterGuard,
  MetadataSchemaDataService,
  MetadataFieldDataService,
  TokenResponseParsingService,
  ReloadGuard,
  EndUserAgreementCurrentUserGuard,
  EndUserAgreementCookieGuard,
  EndUserAgreementService,
  // register AuthInterceptor as HttpInterceptor
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
  // register LocaleInterceptor as HttpInterceptor
  {
    provide: HTTP_INTERCEPTORS,
    useClass: LocaleInterceptor,
    multi: true
  },
  // register DSpaceHeaderInterceptor as HttpInterceptor
  {
    provide: HTTP_INTERCEPTORS,
    useClass: DSpaceHeaderInterceptor,
    multi: true
  },
  NotificationsService,
  FilteredDiscoveryPageResponseParsingService,
  { provide: NativeWindowService, useFactory: NativeWindowFactory },
  VocabularyService,
  VocabularyEntriesResponseParsingService,
  VocabularyTreeviewService
];

/**
 * Declaration needed to make sure all decorator functions are called in time
 */
export const models =
  [
    DSpaceObject,
    Bundle,
    Bitstream,
    BitstreamFormat,
    Item,
    Site,
    Collection,
    Community,
    EPerson,
    Group,
    ResourcePolicy,
    MetadataSchema,
    MetadataField,
    License,
    WorkflowItem,
    WorkspaceItem,
    SubmissionCcLicence,
    SubmissionCcLicenceUrl,
    SubmissionDefinitionsModel,
    SubmissionFormsModel,
    SubmissionSectionModel,
    SubmissionUploadsModel,
    AuthStatus,
    BrowseEntry,
    BrowseDefinition,
    ClaimedTask,
    TaskObject,
    PoolTask,
    Relationship,
    RelationshipType,
    ItemType,
    ExternalSource,
    ExternalSourceEntry,
    Script,
    Process,
    Version,
    VersionHistory,
    WorkflowAction,
    TemplateItem,
    Feature,
    Authorization,
    Registration,
    Vocabulary,
    VocabularyEntry,
    VocabularyEntryDetail,
    ConfigurationProperty,
    UsageReport,
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
