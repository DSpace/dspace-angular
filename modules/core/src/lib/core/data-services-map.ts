import { Type } from '@angular/core';

import { ACCESS_STATUS } from './access-status';
import { ADMIN_NOTIFY_MESSAGE } from './admin';
import { SUBMISSION_COAR_NOTIFY_CONFIG } from './coar-notify';
import {
  BULK_ACCESS_CONDITION_OPTIONS,
  SUBMISSION_ACCESSES_TYPE,
  SUBMISSION_FORMS_TYPE,
  SUBMISSION_UPLOADS_TYPE,
} from './config';
import {
  DUPLICATE,
  HALDataService,
  IDENTIFIERS,
  LDN_SERVICE,
  LDN_SERVICE_CONSTRAINT_FILTERS,
  ROOT,
  SUBSCRIPTION,
} from './data';
import {
  EPERSON,
  GROUP,
  WORKFLOWITEM,
  WORKSPACEITEM,
} from './eperson';
import { FEEDBACK } from './feedback';
import {
  METADATA_FIELD,
  METADATA_SCHEMA,
} from './metadata';
import {
  QUALITY_ASSURANCE_EVENT_OBJECT,
  QUALITY_ASSURANCE_SOURCE_OBJECT,
  QUALITY_ASSURANCE_TOPIC_OBJECT,
  SUGGESTION,
  SUGGESTION_SOURCE,
  SUGGESTION_TARGET,
} from './notifications';
import { NOTIFYREQUEST } from './notify-requests';
import {
  ORCID_HISTORY,
  ORCID_QUEUE,
} from './orcid';
import { PROCESS } from './processes';
import { RESEARCHER_PROFILE } from './profile';
import { RESOURCE_POLICY } from './resource-policy';
import { SCRIPT } from './scripts';
import {
  AUTHORIZATION,
  BITSTREAM,
  BITSTREAM_FORMAT,
  BROWSE_DEFINITION,
  BUNDLE,
  COLLECTION,
  COMMUNITY,
  CONFIG_PROPERTY,
  DSPACE_OBJECT,
  FEATURE,
  ITEM,
  ITEM_TYPE,
  LICENSE,
  RELATIONSHIP,
  RELATIONSHIP_TYPE,
  SITE,
  VERSION,
  VERSION_HISTORY,
} from './shared';
import { USAGE_REPORT } from './statistics';
import {
  CorrectionType,
  SUBMISSION_CC_LICENSE,
  SUBMISSION_CC_LICENSE_URL,
  VOCABULARY,
  VOCABULARY_ENTRY,
  VOCABULARY_ENTRY_DETAIL,
} from './submission';
import { SUPERVISION_ORDER } from './supervision-order';
import { SYSTEMWIDEALERT } from './system-wide-alert';
import {
  CLAIMED_TASK,
  POOL_TASK,
  WORKFLOW_ACTION,
} from './tasks';

export type LazyDataServicesMap = Map<string, () => Promise<Type<HALDataService<any>> | { default: HALDataService<any> }>>;


export const LAZY_DATA_SERVICES: LazyDataServicesMap = new Map([
  [AUTHORIZATION.value, () => import('./data/feature-authorization/authorization-data.service').then(m => m.AuthorizationDataService)],
  [BROWSE_DEFINITION.value, () => import('./browse/browse-definition-data.service').then(m => m.BrowseDefinitionDataService)],
  [BULK_ACCESS_CONDITION_OPTIONS.value, () => import('./config/bulk-access-config-data.service').then(m => m.BulkAccessConfigDataService)],
  [METADATA_SCHEMA.value, () => import('./data/metadata-schema-data.service').then(m => m.MetadataSchemaDataService)],
  [SUBMISSION_UPLOADS_TYPE.value, () => import('./config/submission-uploads-config-data.service').then(m => m.SubmissionUploadsConfigDataService)],
  [BITSTREAM.value, () => import('./data/bitstream-data.service').then(m => m.BitstreamDataService)],
  [SUBMISSION_ACCESSES_TYPE.value, () => import('./config/submission-accesses-config-data.service').then(m => m.SubmissionAccessesConfigDataService)],
  [SYSTEMWIDEALERT.value, () => import('./data/system-wide-alert-data.service').then(m => m.SystemWideAlertDataService)],
  [USAGE_REPORT.value, () => import('./statistics/usage-report-data.service').then(m => m.UsageReportDataService)],
  [ACCESS_STATUS.value, () => import('./data/access-status-data.service').then(m => m.AccessStatusDataService)],
  [COLLECTION.value, () => import('./data/collection-data.service').then(m => m.CollectionDataService)],
  [CLAIMED_TASK.value, () => import('./tasks/claimed-task-data.service').then(m => m.ClaimedTaskDataService)],
  [VOCABULARY_ENTRY.value, () => import('./data/href-only-data.service').then(m => m.HrefOnlyDataService)],
  [ITEM_TYPE.value, () => import('./data/href-only-data.service').then(m => m.HrefOnlyDataService)],
  [LICENSE.value, () => import('./data/href-only-data.service').then(m => m.HrefOnlyDataService)],
  [SUBSCRIPTION.value, () => import('./data/subscriptions-data.service').then(m => m.SubscriptionsDataService)],
  [COMMUNITY.value, () => import('./data/community-data.service').then(m => m.CommunityDataService)],
  [VOCABULARY.value, () => import('./submission/vocabularies/vocabulary.data.service').then(m => m.VocabularyDataService)],
  [BUNDLE.value, () => import('./data/bundle-data.service').then(m => m.BundleDataService)],
  [CONFIG_PROPERTY.value, () => import('./data/configuration-data.service').then(m => m.ConfigurationDataService)],
  [POOL_TASK.value, () => import('./tasks/pool-task-data.service').then(m => m.PoolTaskDataService)],
  [CLAIMED_TASK.value, () => import('./tasks/claimed-task-data.service').then(m => m.ClaimedTaskDataService)],
  [SUPERVISION_ORDER.value, () => import('./supervision-order/supervision-order-data.service').then(m => m.SupervisionOrderDataService)],
  [WORKSPACEITEM.value, () => import('./submission/workspaceitem-data.service').then(m => m.WorkspaceitemDataService)],
  [WORKFLOWITEM.value, () => import('./submission/workflowitem-data.service').then(m => m.WorkflowItemDataService)],
  [VOCABULARY.value, () => import('./submission/vocabularies/vocabulary.data.service').then(m => m.VocabularyDataService)],
  [VOCABULARY_ENTRY_DETAIL.value, () => import('./submission/vocabularies/vocabulary-entry-details.data.service').then(m => m.VocabularyEntryDetailsDataService)],
  [SUBMISSION_CC_LICENSE_URL.value, () => import('./submission/submission-cc-license-url-data.service').then(m => m.SubmissionCcLicenseUrlDataService)],
  [SUBMISSION_CC_LICENSE.value, () => import('./submission/submission-cc-license-data.service').then(m => m.SubmissionCcLicenseDataService)],
  [USAGE_REPORT.value, () => import('./statistics/usage-report-data.service').then(m => m.UsageReportDataService)],
  [RESOURCE_POLICY.value, () => import('./resource-policy/resource-policy-data.service').then(m => m.ResourcePolicyDataService)],
  [RESEARCHER_PROFILE.value, () => import('./profile/researcher-profile-data.service').then(m => m.ResearcherProfileDataService)],
  [ORCID_QUEUE.value, () => import('./orcid/orcid-queue-data.service').then(m => m.OrcidQueueDataService)],
  [ORCID_HISTORY.value, () => import('./orcid/orcid-history-data.service').then(m => m.OrcidHistoryDataService)],
  [FEEDBACK.value, () => import('./feedback/feedback-data.service').then(m => m.FeedbackDataService)],
  [GROUP.value, () => import('./eperson/group-data.service').then(m => m.GroupDataService)],
  [EPERSON.value, () => import('./eperson/eperson-data.service').then(m => m.EPersonDataService)],
  [WORKFLOW_ACTION.value, () => import('./data/workflow-action-data.service').then(m => m.WorkflowActionDataService)],
  [VERSION_HISTORY.value, () => import('./data/version-history-data.service').then(m => m.VersionHistoryDataService)],
  [SITE.value, () => import('./data/site-data.service').then(m => m.SiteDataService)],
  [ROOT.value, () => import('./data/root-data.service').then(m => m.RootDataService)],
  [RELATIONSHIP_TYPE.value, () => import('./data/relationship-type-data.service').then(m => m.RelationshipTypeDataService)],
  [RELATIONSHIP.value, () => import('./data/relationship-data.service').then(m => m.RelationshipDataService)],
  [SCRIPT.value, () => import('./data/processes/script-data.service').then(m => m.ScriptDataService)],
  [PROCESS.value, () => import('./data/processes/process-data.service').then(m => m.ProcessDataService)],
  [METADATA_FIELD.value, () => import('./data/metadata-field-data.service').then(m => m.MetadataFieldDataService)],
  [ITEM.value, () => import('./data/item-data.service').then(m => m.ItemDataService)],
  [VERSION.value, () => import('./data/version-data.service').then(m => m.VersionDataService)],
  [IDENTIFIERS.value, () => import('./data/identifier-data.service').then(m => m.IdentifierDataService)],
  [FEATURE.value, () => import('./data/feature-authorization/authorization-data.service').then(m => m.AuthorizationDataService)],
  [DSPACE_OBJECT.value, () => import('./data/dspace-object-data.service').then(m => m.DSpaceObjectDataService)],
  [BITSTREAM_FORMAT.value, () => import('./data/bitstream-format-data.service').then(m => m.BitstreamFormatDataService)],
  [SUBMISSION_COAR_NOTIFY_CONFIG.value, () => import('./coar-notify/coar-notify-config-data.service').then(m => m.CoarNotifyConfigDataService)],
  [LDN_SERVICE_CONSTRAINT_FILTERS.value, () => import('./admin/ldn-services-data/ldn-itemfilters-data.service').then(m => m.LdnItemfiltersService)],
  [LDN_SERVICE.value, () => import('./admin/ldn-services-data/ldn-services-data.service').then(m => m.LdnServicesService)],
  [ADMIN_NOTIFY_MESSAGE.value, () => import('./admin/admin-notify-message/admin-notify-messages.service').then(m => m.AdminNotifyMessagesService)],
  [SUBMISSION_FORMS_TYPE.value, () => import('./config/submission-forms-config-data.service').then(m => m.SubmissionFormsConfigDataService)],
  [NOTIFYREQUEST.value, () => import('./data/notify-services-status-data.service').then(m => m.NotifyRequestsStatusDataService)],
  [QUALITY_ASSURANCE_EVENT_OBJECT.value, () => import('./notifications/qa/events/quality-assurance-event-data.service').then(m => m.QualityAssuranceEventDataService)],
  [QUALITY_ASSURANCE_SOURCE_OBJECT.value, () => import('./notifications/qa/source/quality-assurance-source-data.service').then(m => m.QualityAssuranceSourceDataService)],
  [QUALITY_ASSURANCE_TOPIC_OBJECT.value, () => import('./notifications/qa/topics/quality-assurance-topic-data.service').then(m => m.QualityAssuranceTopicDataService)],
  [SUGGESTION.value, () => import('./notifications/suggestions/suggestion-data.service').then(m => m.SuggestionDataService)],
  [SUGGESTION_SOURCE.value, () => import('./notifications/suggestions/source/suggestion-source-data.service').then(m => m.SuggestionSourceDataService)],
  [SUGGESTION_TARGET.value, () => import('./notifications/suggestions/target/suggestion-target-data.service').then(m => m.SuggestionTargetDataService)],
  [DUPLICATE.value, () => import('./submission/submission-duplicate-data.service').then(m => m.SubmissionDuplicateDataService)],
  [CorrectionType.type.value, () => import('./submission/correctiontype-data.service').then(m => m.CorrectionTypeDataService)],
]);
