import { HttpClient } from '@angular/common/http';
import {
  inject,
  makeEnvironmentProviders,
} from '@angular/core';

import { Itemfilter } from './data/ldn/ldn-service-itemfilters';
import { LdnService } from './data/ldn/ldn-services.model';
import { AccessStatusObject } from './access-status/access-status.model';
import { Subscription } from './subscription/subscription.model';
import { SubmissionCoarNotifyConfig } from './coar-notify/submission-coar-notify.config';
import { AuthStatus } from './auth';
import { ShortLivedToken } from './auth';
import { APP_CONFIG } from './config';
import { BulkAccessConditionOptions } from './config';
import { SubmissionAccessesModel } from './config';
import { SubmissionDefinitionsModel } from './config';
import { SubmissionFormsModel } from './config';
import { SubmissionSectionModel } from './config';
import { SubmissionUploadsModel } from './config';
import { IdentifierData } from './data';
import { Root } from './data';
import { DspaceRestService } from './dspace-rest';
import { EPerson } from './eperson';
import { Group } from './eperson';
import { MetadataField } from './metadata';
import { MetadataSchema } from './metadata';
import { EndpointMockingRestService } from './mocks/endpoint-mocking-rest.service';

import { QualityAssuranceEventObject } from './notifications';
import { QualityAssuranceSourceObject } from './notifications';
import { QualityAssuranceTopicObject } from './notifications';
import { SuggestionSource } from './notifications';
import { SuggestionTarget } from './notifications';
import { NotifyRequestsStatus } from './notify-requests';
import { OrcidHistory } from './orcid';
import { OrcidQueue } from './orcid';
import { Process } from './processes';
import { ResearcherProfile } from './profile';
import { ResourcePolicy } from './resource-policy';
import { Script } from './scripts';
import { Authorization } from './shared';
import { Bitstream } from './shared';
import { BitstreamFormat } from './shared';
import { BrowseDefinition } from './shared';
import { BrowseEntry } from './shared';
import { Bundle } from './shared';
import { Collection } from './shared';
import { Community } from './shared';
import { ConfigurationProperty } from './shared';
import { DSpaceObject } from './shared';
import { ExternalSource } from './shared';
import { ExternalSourceEntry } from './shared';
import { Feature } from './shared';
import { FlatBrowseDefinition } from './shared';
import { HierarchicalBrowseDefinition } from './shared';
import { Item } from './shared';
import { ItemType } from './shared';
import { Relationship } from './shared';
import { RelationshipType } from './shared';
import { ItemRequest } from './shared';
import { License } from './shared';
import { NonHierarchicalBrowseDefinition } from './shared';
import { Registration } from './shared';
import { SearchConfig } from './shared';
import { Site } from './shared';
import { TemplateItem } from './shared';
import { ValueListBrowseDefinition } from './shared';
import { Version } from './shared';
import { VersionHistory } from './shared';
import { UsageReport } from './statistics';
import { SubmissionCcLicence } from './submission';
import { SubmissionCcLicenceUrl } from './submission';
import { WorkflowItem } from './submission';
import { WorkspaceItem } from './submission';
import { Vocabulary } from './submission';
import { VocabularyEntry } from './submission';
import { VocabularyEntryDetail } from './submission';
import { SystemWideAlert } from './system-wide-alert';
import { AdvancedWorkflowInfo } from './tasks';
import { ClaimedTask } from './tasks';
import { PoolTask } from './tasks';
import { RatingAdvancedWorkflowInfo } from './tasks';
import { SelectReviewerAdvancedWorkflowInfo } from './tasks';
import { TaskObject } from './tasks';
import { WorkflowAction } from './tasks';
import { MOCK_RESPONSE_MAP, ResponseMapMock } from "./mocks/response-map.mock";


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
