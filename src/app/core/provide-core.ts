import { HttpClient } from '@angular/common/http';
import {
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { APP_CONFIG } from '@dspace/config/app-config.interface';

import { AuthStatus } from './auth/models/auth-status.model';
import { ShortLivedToken } from './auth/models/short-lived-token.model';
import { Itemfilter } from './coar-notify/ldn-services/models/ldn-service-itemfilters';
import { LdnService } from './coar-notify/ldn-services/models/ldn-services.model';
import { AdminNotifyMessage } from './coar-notify/notify-info/models/admin-notify-message.model';
import { NotifyRequestsStatus } from './coar-notify/notify-info/models/notify-requests-status.model';
import { SubmissionCoarNotifyModel } from './coar-notify/notify-info/models/submission-coar-notify.model';
import { BulkAccessConditionOptions } from './config/models/bulk-access-condition-options.model';
import { SubmissionAccessModel } from './config/models/config-submission-access.model';
import { SubmissionAccessesModel } from './config/models/config-submission-accesses.model';
import { SubmissionDefinitionModel } from './config/models/config-submission-definition.model';
import { SubmissionDefinitionsModel } from './config/models/config-submission-definitions.model';
import { SubmissionFormModel } from './config/models/config-submission-form.model';
import { SubmissionFormsModel } from './config/models/config-submission-forms.model';
import { SubmissionSectionModel } from './config/models/config-submission-section.model';
import { SubmissionSectionsModel } from './config/models/config-submission-sections.model';
import { SubmissionUploadModel } from './config/models/config-submission-upload.model';
import { SubmissionUploadsModel } from './config/models/config-submission-uploads.model';
import { PaginatedList } from './data/paginated-list.model';
import { Root } from './data/root.model';
import { DspaceRestService } from './dspace-rest/dspace-rest.service';
import { EndpointMockingRestService } from './dspace-rest/endpoint-mocking-rest.service';
import {
  MOCK_RESPONSE_MAP,
  ResponseMapMock,
} from './dspace-rest/mocks/response-map.mock';
import { EPerson } from './eperson/models/eperson.model';
import { Group } from './eperson/models/group.model';
import { Feedback } from './feedback/models/feedback.model';
import { MetadataField } from './metadata/metadata-field.model';
import { MetadataSchema } from './metadata/metadata-schema.model';
import { QualityAssuranceEventObject } from './notifications/qa/models/quality-assurance-event.model';
import { QualityAssuranceSourceObject } from './notifications/qa/models/quality-assurance-source.model';
import { QualityAssuranceTopicObject } from './notifications/qa/models/quality-assurance-topic.model';
import { Suggestion } from './notifications/suggestions/models/suggestion.model';
import { SuggestionSource } from './notifications/suggestions/models/suggestion-source.model';
import { SuggestionTarget } from './notifications/suggestions/models/suggestion-target.model';
import { OrcidHistory } from './orcid/model/orcid-history.model';
import { OrcidQueue } from './orcid/model/orcid-queue.model';
import { Filetypes } from './processes/filetypes.model';
import { Process } from './processes/process.model';
import { ResearcherProfile } from './profile/model/researcher-profile.model';
import { ResourcePolicy } from './resource-policy/models/resource-policy.model';
import { AccessStatusObject } from './shared/access-status.model';
import { Authorization } from './shared/authorization.model';
import { Bitstream } from './shared/bitstream.model';
import { BitstreamFormat } from './shared/bitstream-format.model';
import { BrowseDefinition } from './shared/browse-definition.model';
import { BrowseEntry } from './shared/browse-entry.model';
import { Bundle } from './shared/bundle.model';
import { Collection } from './shared/collection.model';
import { Community } from './shared/community.model';
import { ConfigurationProperty } from './shared/configuration-property.model';
import { ContentSource } from './shared/content-source.model';
import { DSpaceObject } from './shared/dspace-object.model';
import { ExternalSource } from './shared/external-source.model';
import { ExternalSourceEntry } from './shared/external-source-entry.model';
import { Feature } from './shared/feature.model';
import { FlatBrowseDefinition } from './shared/flat-browse-definition.model';
import { HierarchicalBrowseDefinition } from './shared/hierarchical-browse-definition.model';
import { IdentifierData } from './shared/identifiers-data/identifier-data.model';
import { Item } from './shared/item.model';
import { ItemType } from './shared/item-relationships/item-type.model';
import { Relationship } from './shared/item-relationships/relationship.model';
import { RelationshipType } from './shared/item-relationships/relationship-type.model';
import { ItemRequest } from './shared/item-request.model';
import { License } from './shared/license.model';
import { ListableNotificationObject } from './shared/listable-notification-object.model';
import { NonHierarchicalBrowseDefinition } from './shared/non-hierarchical-browse-definition';
import { Registration } from './shared/registration.model';
import { Script } from './shared/scripts/script.model';
import { FacetConfigResponse } from './shared/search/models/facet-config-response.model';
import { FacetValues } from './shared/search/models/facet-values.model';
import { SearchFilterConfig } from './shared/search/models/search-filter-config.model';
import { SearchObjects } from './shared/search/models/search-objects.model';
import { SearchResult } from './shared/search/models/search-result.model';
import { SearchConfig } from './shared/search/search-filters/search-config.model';
import { Site } from './shared/site.model';
import { Subscription } from './shared/subscription.model';
import { SystemWideAlert } from './shared/system-wide-alert.model';
import { TemplateItem } from './shared/template-item.model';
import { ValueListBrowseDefinition } from './shared/value-list-browse-definition.model';
import { Version } from './shared/version.model';
import { VersionHistory } from './shared/version-history.model';
import { StatisticsEndpoint } from './statistics/models/statistics-endpoint.model';
import { UsageReport } from './statistics/models/usage-report.model';
import { CorrectionType } from './submission/models/correctiontype.model';
import { SubmissionCcLicence } from './submission/models/submission-cc-license.model';
import { SubmissionCcLicenceUrl } from './submission/models/submission-cc-license-url.model';
import { WorkflowItem } from './submission/models/workflowitem.model';
import { WorkspaceItem } from './submission/models/workspaceitem.model';
import { Vocabulary } from './submission/vocabularies/models/vocabulary.model';
import { VocabularyEntry } from './submission/vocabularies/models/vocabulary-entry.model';
import { VocabularyEntryDetail } from './submission/vocabularies/models/vocabulary-entry-detail.model';
import { SupervisionOrder } from './supervision-order/models/supervision-order.model';
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
    UsageReport,
    QualityAssuranceTopicObject,
    QualityAssuranceEventObject,
    SearchConfig,
    SubmissionAccessesModel,
    QualityAssuranceSourceObject,
    AccessStatusObject,
    ResearcherProfile,
    OrcidQueue,
    OrcidHistory,
    IdentifierData,
    Subscription,
    ItemRequest,
    BulkAccessConditionOptions,
    SuggestionTarget,
    SuggestionSource,
    LdnService,
    Itemfilter,
    SubmissionCoarNotifyModel,
    NotifyRequestsStatus,
    SystemWideAlert,
    AdminNotifyMessage,
    SubmissionAccessModel,
    SubmissionDefinitionModel,
    SubmissionFormModel,
    SubmissionSectionsModel,
    SubmissionUploadModel,
    PaginatedList,
    Feedback,
    Suggestion,
    Filetypes,
    ContentSource,
    ListableNotificationObject,
    FacetConfigResponse,
    FacetValues,
    SearchFilterConfig,
    SearchObjects,
    SearchResult,
    StatisticsEndpoint,
    CorrectionType,
    SupervisionOrder,
  ];
