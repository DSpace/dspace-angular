import { importProvidersFrom, makeEnvironmentProviders } from '@angular/core';
import { DspaceRestService } from './dspace-rest/dspace-rest.service';
import { MOCK_RESPONSE_MAP, ResponseMapMock } from '../shared/mocks/dspace-rest/mocks/response-map.mock';
import { HttpClient } from '@angular/common/http';
import { EndpointMockingRestService } from '../shared/mocks/dspace-rest/endpoint-mocking-rest.service';
import { AuthStatus } from './auth/models/auth-status.model';
import { SubmissionDefinitionsModel } from './config/models/config-submission-definitions.model';
import { SubmissionFormsModel } from './config/models/config-submission-forms.model';
import { SubmissionSectionModel } from './config/models/config-submission-section.model';
import { SubmissionUploadsModel } from './config/models/config-submission-uploads.model';
import { EPerson } from './eperson/models/eperson.model';
import { Group } from './eperson/models/group.model';
import { MetadataField } from './metadata/metadata-field.model';
import { MetadataSchema } from './metadata/metadata-schema.model';
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
import { ItemType } from './shared/item-relationships/item-type.model';
import { RelationshipType } from './shared/item-relationships/relationship-type.model';
import { Relationship } from './shared/item-relationships/relationship.model';
import { Item } from './shared/item.model';
import { License } from './shared/license.model';
import { ResourcePolicy } from './resource-policy/models/resource-policy.model';
import { Site } from './shared/site.model';
import { WorkflowItem } from './submission/models/workflowitem.model';
import { WorkspaceItem } from './submission/models/workspaceitem.model';
import { ClaimedTask } from './tasks/models/claimed-task-object.model';
import { PoolTask } from './tasks/models/pool-task-object.model';
import { TaskObject } from './tasks/models/task-object.model';
import { environment } from '../../environments/environment';
import { Version } from './shared/version.model';
import { VersionHistory } from './shared/version-history.model';
import { Script } from '../process-page/scripts/script.model';
import { Process } from '../process-page/processes/process.model';
import { WorkflowAction } from './tasks/models/workflow-action-object.model';
import { TemplateItem } from './shared/template-item.model';
import { Feature } from './shared/feature.model';
import { Authorization } from './shared/authorization.model';
import { Registration } from './shared/registration.model';
import { SubmissionCcLicence } from './submission/models/submission-cc-license.model';
import { SubmissionCcLicenceUrl } from './submission/models/submission-cc-license-url.model';
import { VocabularyEntry } from './submission/vocabularies/models/vocabulary-entry.model';
import { Vocabulary } from './submission/vocabularies/models/vocabulary.model';
import { VocabularyEntryDetail } from './submission/vocabularies/models/vocabulary-entry-detail.model';
import { ConfigurationProperty } from './shared/configuration-property.model';
import { ShortLivedToken } from './auth/models/short-lived-token.model';
import { UsageReport } from './statistics/models/usage-report.model';
import { Root } from './data/root.model';
import { SearchConfig } from './shared/search/search-filters/search-config.model';
import { SubmissionAccessesModel } from './config/models/config-submission-accesses.model';
import { RatingAdvancedWorkflowInfo } from './tasks/models/rating-advanced-workflow-info.model';
import { AdvancedWorkflowInfo } from './tasks/models/advanced-workflow-info.model';
import { SelectReviewerAdvancedWorkflowInfo } from './tasks/models/select-reviewer-advanced-workflow-info.model';
import { AccessStatusObject } from '../shared/object-collection/shared/badges/access-status-badge/access-status.model';
import { ResearcherProfile } from './profile/model/researcher-profile.model';
import { OrcidQueue } from './orcid/model/orcid-queue.model';
import { OrcidHistory } from './orcid/model/orcid-history.model';
import { IdentifierData } from '../shared/object-list/identifier-data/identifier-data.model';
import { Subscription } from '../shared/subscriptions/models/subscription.model';
import { ItemRequest } from './shared/item-request.model';
import { HierarchicalBrowseDefinition } from './shared/hierarchical-browse-definition.model';
import { FlatBrowseDefinition } from './shared/flat-browse-definition.model';
import { ValueListBrowseDefinition } from './shared/value-list-browse-definition.model';
import { NonHierarchicalBrowseDefinition } from './shared/non-hierarchical-browse-definition';
import { BulkAccessConditionOptions } from './config/models/bulk-access-condition-options.model';
import { Action, StoreConfig, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { coreReducers } from './core.reducers';
import { storeModuleConfig } from '../app.reducer';
import { CoreState } from './core-state.model';
import { coreEffects } from './core.effects';


export const provideCore = () => {
  console.log('provideCore');
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
    Root,
    SearchConfig,
    SubmissionAccessesModel,
    AccessStatusObject,
    ResearcherProfile,
    OrcidQueue,
    OrcidHistory,
    AccessStatusObject,
    IdentifierData,
    Subscription,
    ItemRequest,
    BulkAccessConditionOptions
  ];
