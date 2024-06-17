import { HttpClient } from '@angular/common/http';
import { makeEnvironmentProviders } from '@angular/core';

import { environment } from '../../environments/environment';
import { Itemfilter } from '../admin/admin-ldn-services/ldn-services-model/ldn-service-itemfilters';
import { LdnService } from '../admin/admin-ldn-services/ldn-services-model/ldn-services.model';
import { NotifyRequestsStatus } from '../item-page/simple/notify-requests-status/notify-requests-status.model';
import { Process } from '../process-page/processes/process.model';
import { Script } from '../process-page/scripts/script.model';
import { EndpointMockingRestService } from '../shared/mocks/dspace-rest/endpoint-mocking-rest.service';
import {
  MOCK_RESPONSE_MAP,
  ResponseMapMock,
} from '../shared/mocks/dspace-rest/mocks/response-map.mock';
import { AccessStatusObject } from '../shared/object-collection/shared/badges/access-status-badge/access-status.model';
import { IdentifierData } from '../shared/object-list/identifier-data/identifier-data.model';
import { Subscription } from '../shared/subscriptions/models/subscription.model';
import { SubmissionCoarNotifyConfig } from '../submission/sections/section-coar-notify/submission-coar-notify.config';
import { AuthStatus } from './auth/models/auth-status.model';
import { ShortLivedToken } from './auth/models/short-lived-token.model';
import { BulkAccessConditionOptions } from './config/models/bulk-access-condition-options.model';
import { SubmissionAccessesModel } from './config/models/config-submission-accesses.model';
import { SubmissionDefinitionsModel } from './config/models/config-submission-definitions.model';
import { SubmissionFormsModel } from './config/models/config-submission-forms.model';
import { SubmissionSectionModel } from './config/models/config-submission-section.model';
import { SubmissionUploadsModel } from './config/models/config-submission-uploads.model';
import { Root } from './data/root.model';
import { DspaceRestService } from './dspace-rest/dspace-rest.service';
import { EPerson } from './eperson/models/eperson.model';
import { Group } from './eperson/models/group.model';
import { MetadataField } from './metadata/metadata-field.model';
import { MetadataSchema } from './metadata/metadata-schema.model';
import { QualityAssuranceEventObject } from './notifications/qa/models/quality-assurance-event.model';
import { QualityAssuranceSourceObject } from './notifications/qa/models/quality-assurance-source.model';
import { QualityAssuranceTopicObject } from './notifications/qa/models/quality-assurance-topic.model';
import { SuggestionSource } from './notifications/suggestions/models/suggestion-source.model';
import { SuggestionTarget } from './notifications/suggestions/models/suggestion-target.model';
import { OrcidHistory } from './orcid/model/orcid-history.model';
import { OrcidQueue } from './orcid/model/orcid-queue.model';
import { ResearcherProfile } from './profile/model/researcher-profile.model';
import { ResourcePolicy } from './resource-policy/models/resource-policy.model';
import { Authorization } from './shared/authorization.model';
import { Bitstream } from './shared/bitstream.model';
import { BitstreamFormat } from './shared/bitstream-format.model';
import { BrowseDefinition } from './shared/browse-definition.model';
import { BrowseEntry } from './shared/browse-entry.model';
import { Bundle } from './shared/bundle.model';
import { Collection } from './shared/collection.model';
import { Community } from './shared/community.model';
import { ConfigurationProperty } from './shared/configuration-property.model';
import { DSpaceObject } from './shared/dspace-object.model';
import { ExternalSource } from './shared/external-source.model';
import { ExternalSourceEntry } from './shared/external-source-entry.model';
import { Feature } from './shared/feature.model';
import { FlatBrowseDefinition } from './shared/flat-browse-definition.model';
import { HierarchicalBrowseDefinition } from './shared/hierarchical-browse-definition.model';
import { Item } from './shared/item.model';
import { ItemType } from './shared/item-relationships/item-type.model';
import { Relationship } from './shared/item-relationships/relationship.model';
import { RelationshipType } from './shared/item-relationships/relationship-type.model';
import { ItemRequest } from './shared/item-request.model';
import { License } from './shared/license.model';
import { NonHierarchicalBrowseDefinition } from './shared/non-hierarchical-browse-definition';
import { Registration } from './shared/registration.model';
import { SearchConfig } from './shared/search/search-filters/search-config.model';
import { Site } from './shared/site.model';
import { TemplateItem } from './shared/template-item.model';
import { ValueListBrowseDefinition } from './shared/value-list-browse-definition.model';
import { Version } from './shared/version.model';
import { VersionHistory } from './shared/version-history.model';
import { UsageReport } from './statistics/models/usage-report.model';
import { SubmissionCcLicence } from './submission/models/submission-cc-license.model';
import { SubmissionCcLicenceUrl } from './submission/models/submission-cc-license-url.model';
import { WorkflowItem } from './submission/models/workflowitem.model';
import { WorkspaceItem } from './submission/models/workspaceitem.model';
import { Vocabulary } from './submission/vocabularies/models/vocabulary.model';
import { VocabularyEntry } from './submission/vocabularies/models/vocabulary-entry.model';
import { VocabularyEntryDetail } from './submission/vocabularies/models/vocabulary-entry-detail.model';
import { AdvancedWorkflowInfo } from './tasks/models/advanced-workflow-info.model';
import { ClaimedTask } from './tasks/models/claimed-task-object.model';
import { PoolTask } from './tasks/models/pool-task-object.model';
import { RatingAdvancedWorkflowInfo } from './tasks/models/rating-advanced-workflow-info.model';
import { SelectReviewerAdvancedWorkflowInfo } from './tasks/models/select-reviewer-advanced-workflow-info.model';
import { TaskObject } from './tasks/models/task-object.model';
import { WorkflowAction } from './tasks/models/workflow-action-object.model';


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
  if (environment.production) {
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
  ];
