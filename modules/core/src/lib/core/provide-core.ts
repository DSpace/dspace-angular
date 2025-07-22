import { HttpClient } from '@angular/common/http';
import {
  inject,
  makeEnvironmentProviders,
} from '@angular/core';

import { AccessStatusObject } from './access-status';
import {
  AuthStatus,
  ShortLivedToken,
} from './auth';
import { SubmissionCoarNotifyConfig } from './coar-notify';
import {
  APP_CONFIG,
  BulkAccessConditionOptions,
  SubmissionAccessesModel,
  SubmissionDefinitionsModel,
  SubmissionFormsModel,
  SubmissionSectionModel,
  SubmissionUploadsModel,
} from './config';
import {
  IdentifierData,
  Itemfilter,
  LdnService,
  Root,
} from './data';
import { DspaceRestService } from './dspace-rest';
import {
  EPerson,
  Group,
} from './eperson';
import {
  MetadataField,
  MetadataSchema,
} from './metadata';
import { EndpointMockingRestService } from './mocks/endpoint-mocking-rest.service';
import {
  MOCK_RESPONSE_MAP,
  ResponseMapMock,
} from './mocks/response-map.mock';
import {
  QualityAssuranceEventObject,
  QualityAssuranceSourceObject,
  QualityAssuranceTopicObject,
  SuggestionSource,
  SuggestionTarget,
} from './notifications';
import { NotifyRequestsStatus } from './notify-requests';
import {
  OrcidHistory,
  OrcidQueue,
} from './orcid';
import { Process } from './processes';
import { ResearcherProfile } from './profile';
import { ResourcePolicy } from './resource-policy';
import { Script } from './scripts';
import {
  Authorization,
  Bitstream,
  BitstreamFormat,
  BrowseDefinition,
  BrowseEntry,
  Bundle,
  Collection,
  Community,
  ConfigurationProperty,
  DSpaceObject,
  ExternalSource,
  ExternalSourceEntry,
  Feature,
  FlatBrowseDefinition,
  HierarchicalBrowseDefinition,
  Item,
  ItemRequest,
  ItemType,
  License,
  NonHierarchicalBrowseDefinition,
  Registration,
  Relationship,
  RelationshipType,
  SearchConfig,
  Site,
  TemplateItem,
  ValueListBrowseDefinition,
  Version,
  VersionHistory,
} from './shared';
import { UsageReport } from './statistics';
import {
  SubmissionCcLicence,
  SubmissionCcLicenceUrl,
  Vocabulary,
  VocabularyEntry,
  VocabularyEntryDetail,
  WorkflowItem,
  WorkspaceItem,
} from './submission';
import { Subscription } from './subscription';
import { SystemWideAlert } from './system-wide-alert';
import {
  AdvancedWorkflowInfo,
  ClaimedTask,
  PoolTask,
  RatingAdvancedWorkflowInfo,
  SelectReviewerAdvancedWorkflowInfo,
  TaskObject,
  WorkflowAction,
} from './tasks';


export const provideCore = () => {
  return makeEnvironmentProviders([
    { provide: DspaceRestService, useFactory: restServiceFactory, deps: [MOCK_RESPONSE_MAP, HttpClient] },
  ]);
};

/**
 * When not in production, endpoint responses can be mocked for testing purposes
 * If there is no mock version available for the endpoint, the actual REST response will be used just like in production mode
 */
export const restServiceFactory = (mocks: ResponseMapMock, http: HttpClient) => {
  if (inject(APP_CONFIG).production) {
    return new DspaceRestService(http);
  } else {
    return new EndpointMockingRestService(mocks, http);
  }
};

/**
 * Declaration needed to make sure all decorator functions are called in time
 */
export const models =
  [
    Root,
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
    NonHierarchicalBrowseDefinition,
    FlatBrowseDefinition,
    ValueListBrowseDefinition,
    HierarchicalBrowseDefinition,
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
    AdvancedWorkflowInfo,
    RatingAdvancedWorkflowInfo,
    SelectReviewerAdvancedWorkflowInfo,
    TemplateItem,
    Feature,
    Authorization,
    Registration,
    Vocabulary,
    VocabularyEntry,
    VocabularyEntryDetail,
    ConfigurationProperty,
    ShortLivedToken,
    Registration,
    UsageReport,
    QualityAssuranceTopicObject,
    QualityAssuranceEventObject,
    Root,
    SearchConfig,
    SubmissionAccessesModel,
    QualityAssuranceSourceObject,
    AccessStatusObject,
    ResearcherProfile,
    OrcidQueue,
    OrcidHistory,
    AccessStatusObject,
    IdentifierData,
    Subscription,
    ItemRequest,
    BulkAccessConditionOptions,
    SuggestionTarget,
    SuggestionSource,
    LdnService,
    Itemfilter,
    SubmissionCoarNotifyConfig,
    NotifyRequestsStatus,
    SystemWideAlert,
  ];
