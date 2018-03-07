import {
  NgModule,
  Optional,
  SkipSelf,
  ModuleWithProviders
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { coreEffects } from './core.effects';
import { coreReducers } from './core.reducers';

import { isNotEmpty } from '../shared/empty.util';

import { ApiService } from '../shared/services/api.service';
import { CollectionDataService } from './data/collection-data.service';
import { CommunityDataService } from './data/community-data.service';
import { DSOResponseParsingService } from './data/dso-response-parsing.service';
import { DSpaceRESTv2Service } from './dspace-rest-v2/dspace-rest-v2.service';
import { FormBuilderService } from '../shared/form/builder/form-builder.service';
import { FormService } from '../shared/form/form.service';
import { GroupEpersonService } from './eperson/group-eperson.service';
import { HostWindowService } from '../shared/host-window.service';
import { ItemDataService } from './data/item-data.service';
import { MetadataService } from './metadata/metadata.service';
import { ObjectCacheService } from './cache/object-cache.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { RemoteDataBuildService } from './cache/builders/remote-data-build.service';
import { RequestService } from './data/request.service';
import { ResponseCacheService } from './cache/response-cache.service';
import { RootResponseParsingService } from './data/root-response-parsing.service';
import { ServerResponseService } from '../shared/services/server-response.service';
import { NativeWindowFactory, NativeWindowService } from '../shared/services/window.service';
import { BrowseService } from './browse/browse.service';
import { BrowseResponseParsingService } from './data/browse-response-parsing.service';
import { ConfigResponseParsingService } from './data/config-response-parsing.service';
import { RouteService } from '../shared/services/route.service';
import { DynamicFormLayoutService, DynamicFormService, DynamicFormValidationService } from '@ng-dynamic-forms/core';

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
import { AuthService } from './auth/auth.service';
import { AuthenticatedGuard } from './auth/authenticated.guard';
import { AuthRequestService } from './auth/auth-request.service';
import { AuthResponseParsingService } from './auth/auth-response-parsing.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { CookieService } from '../shared/services/cookie.service';
import { PlatformService } from '../shared/services/platform.service';
import { JsonPatchOperationsService } from './json-patch/json-patch-operations.service';
import { PostPatchDataService } from './data/postpatch-data.service';
import { MessageService } from './message/message.service';
import { MessageResponseParsingService } from './message/message-response-parsing.service';
import { WorkflowitemDataService } from './submission/workflowitem-data.service';
import { ClaimedTaskDataService } from './tasks/claimed-task-data.service';
import { PoolTaskDataService } from './tasks/pool-task-data.service';
import { NotificationsService } from '../shared/notifications/notifications.service';

import { RolesService } from './roles/roles.service';
import { TaskResponseParsingService } from './tasks/task-response-parsing.service';

const IMPORTS = [
  CommonModule,
  StoreModule.forFeature('core', coreReducers, {}),
  EffectsModule.forFeature(coreEffects),
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
  AuthService,
  CommunityDataService,
  CollectionDataService,
  CookieService,
  DSOResponseParsingService,
  DSpaceRESTv2Service,
  DynamicFormLayoutService,
  DynamicFormService,
  DynamicFormValidationService,
  FormBuilderService,
  FormService,
  EpersonResponseParsingService,
  GroupEpersonService,
  HostWindowService,
  ItemDataService,
  MetadataService,
  ObjectCacheService,
  PaginationComponentOptions,
  PlatformService,
  RemoteDataBuildService,
  RequestService,
  ResponseCacheService,
  RootResponseParsingService,
  ServerResponseService,
  BrowseResponseParsingService,
  BrowseService,
  ConfigResponseParsingService,
  RouteService,
  SubmissionDefinitionsConfigService,
  SubmissionFormsConfigService,
  SubmissionSectionsConfigService,
  SubmissionResponseParsingService,
  JsonPatchOperationsBuilder,
  JsonPatchOperationsService,
  AuthorityService,
  IntegrationResponseParsingService,
  UUIDService,
  NotificationsService,  
  WorkspaceitemDataService,
  WorkflowitemDataService,
  ClaimedTaskDataService,
  PoolTaskDataService,
  MessageService,
  MessageResponseParsingService,
  TaskResponseParsingService,
  RolesService,
  { provide: NativeWindowService, useFactory: NativeWindowFactory },
  // register AuthInterceptor as HttpInterceptor
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }

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
