import { AUTHORIZATION } from './core/shared/authorization.resource-type';
import { BROWSE_DEFINITION } from './core/shared/browse-definition.resource-type';
import {
  BULK_ACCESS_CONDITION_OPTIONS,
  SUBMISSION_ACCESSES_TYPE,
  SUBMISSION_FORMS_TYPE,
  SUBMISSION_UPLOADS_TYPE
} from './core/config/models/config-type';
import { METADATA_SCHEMA } from './core/metadata/metadata-schema.resource-type';
import { BITSTREAM } from './core/shared/bitstream.resource-type';
import { SYSTEMWIDEALERT } from './system-wide-alert/system-wide-alert.resource-type';
import { USAGE_REPORT } from './core/statistics/models/usage-report.resource-type';
import {
  ACCESS_STATUS
} from './shared/object-collection/shared/badges/access-status-badge/access-status.resource-type';
import { COLLECTION } from './core/shared/collection.resource-type';
import { CLAIMED_TASK } from './core/tasks/models/claimed-task-object.resource-type';
import {
  VOCABULARY,
  VOCABULARY_ENTRY,
  VOCABULARY_ENTRY_DETAIL
} from './core/submission/vocabularies/models/vocabularies.resource-type';
import { ITEM_TYPE } from './core/shared/item-relationships/item-type.resource-type';
import { LICENSE } from './core/shared/license.resource-type';
import { SUBSCRIPTION } from './shared/subscriptions/models/subscription.resource-type';
import { COMMUNITY } from './core/shared/community.resource-type';
import { BUNDLE } from './core/shared/bundle.resource-type';
import { CONFIG_PROPERTY } from './core/shared/config-property.resource-type';
import { POOL_TASK } from './core/tasks/models/pool-task-object.resource-type';
import { SUPERVISION_ORDER } from './core/supervision-order/models/supervision-order.resource-type';
import { WorkspaceItem } from './core/submission/models/workspaceitem.model';
import { WorkflowItem } from './core/submission/models/workflowitem.model';
import { SUBMISSION_CC_LICENSE_URL } from './core/submission/models/submission-cc-licence-link.resource-type';
import { SUBMISSION_CC_LICENSE } from './core/submission/models/submission-cc-licence.resource-type';
import { RESOURCE_POLICY } from './core/resource-policy/models/resource-policy.resource-type';
import { RESEARCHER_PROFILE } from './core/profile/model/researcher-profile.resource-type';
import { ORCID_QUEUE } from './core/orcid/model/orcid-queue.resource-type';
import { ORCID_HISTORY } from './core/orcid/model/orcid-history.resource-type';
import { FEEDBACK } from './core/feedback/models/feedback.resource-type';
import { GROUP } from './core/eperson/models/group.resource-type';
import { EPERSON } from './core/eperson/models/eperson.resource-type';
import { WORKFLOW_ACTION } from './core/tasks/models/workflow-action-object.resource-type';
import { VERSION_HISTORY } from './core/shared/version-history.resource-type';
import { SITE } from './core/shared/site.resource-type';
import { ROOT } from './core/data/root.resource-type';
import { RELATIONSHIP_TYPE } from './core/shared/item-relationships/relationship-type.resource-type';
import { RELATIONSHIP } from './core/shared/item-relationships/relationship.resource-type';
import { SCRIPT } from './process-page/scripts/script.resource-type';
import { PROCESS } from './process-page/processes/process.resource-type';
import { METADATA_FIELD } from './core/metadata/metadata-field.resource-type';
import { ITEM } from './core/shared/item.resource-type';
import { VERSION } from './core/shared/version.resource-type';
import { IDENTIFIERS } from './shared/object-list/identifier-data/identifier-data.resource-type';
import { FEATURE } from './core/shared/feature.resource-type';
import { DSPACE_OBJECT } from './core/shared/dspace-object.resource-type';
import { BITSTREAM_FORMAT } from './core/shared/bitstream-format.resource-type';
import { Type } from '@angular/core';
import { HALDataService } from './core/data/base/hal-data-service.interface';

export const LAZY_DATA_SERVICES: {[key: string]: () => Promise<Type<HALDataService<any>>>} = {
  [AUTHORIZATION.value]: () => import('./core/data/feature-authorization/authorization-data.service').then(m => m.AuthorizationDataService),
  [BROWSE_DEFINITION.value]: () => import('./core/browse/browse-definition-data.service').then(m => m.BrowseDefinitionDataService),
  [BULK_ACCESS_CONDITION_OPTIONS.value]: () => import('./core/config/bulk-access-config-data.service').then(m => m.BulkAccessConfigDataService),
  [METADATA_SCHEMA.value]: () => import('./core/data/metadata-schema-data.service').then(m => m.MetadataSchemaDataService),
  [SUBMISSION_UPLOADS_TYPE.value]: () => import('./core/config/submission-uploads-config-data.service').then(m => m.SubmissionUploadsConfigDataService),
  [BITSTREAM.value]: () => import('./core/data/bitstream-data.service').then(m => m.BitstreamDataService),
  [SUBMISSION_ACCESSES_TYPE.value]: () => import('./core/config/submission-accesses-config-data.service').then(m => m.SubmissionAccessesConfigDataService),
  [SYSTEMWIDEALERT.value]: () => import('./core/data/system-wide-alert-data.service').then(m => m.SystemWideAlertDataService),
  [USAGE_REPORT.value]: () => import('./core/statistics/usage-report-data.service').then(m => m.UsageReportDataService),
  [ACCESS_STATUS.value]: () => import('./core/data/access-status-data.service').then(m => m.AccessStatusDataService),
  [COLLECTION.value]: () => import('./core/data/collection-data.service').then(m => m.CollectionDataService),
  [CLAIMED_TASK.value]: () => import('./core/tasks/claimed-task-data.service').then(m => m.ClaimedTaskDataService),
  [VOCABULARY_ENTRY.value]: () => import('./core/data/href-only-data.service').then(m => m.HrefOnlyDataService),
  [ITEM_TYPE.value]: () => import('./core/data/href-only-data.service').then(m => m.HrefOnlyDataService),
  [LICENSE.value]: () => import('./core/data/href-only-data.service').then(m => m.HrefOnlyDataService),
  [SUBSCRIPTION.value]: () => import('./shared/subscriptions/subscriptions-data.service').then(m => m.SubscriptionsDataService),
  [COMMUNITY.value]: () => import('./core/data/community-data.service').then(m => m.CommunityDataService),
  [VOCABULARY.value]: () => import('./core/submission/vocabularies/vocabulary.data.service').then(m => m.VocabularyDataService),
  [BUNDLE.value]: () => import('./core/data/bundle-data.service').then(m => m.BundleDataService),
  [CONFIG_PROPERTY.value]: () => import('./core/data/configuration-data.service').then(m => m.ConfigurationDataService),
  [POOL_TASK.value]: () => import('./core/tasks/pool-task-data.service').then(m => m.PoolTaskDataService),
  [CLAIMED_TASK.value]: () => import('./core/tasks/claimed-task-data.service').then(m => m.ClaimedTaskDataService),
  [SUPERVISION_ORDER.value]: () => import('./core/supervision-order/supervision-order-data.service').then(m => m.SupervisionOrderDataService),
  [WorkspaceItem.type.value]: () => import('./core/submission/workspaceitem-data.service').then(m => m.WorkspaceitemDataService),
  [WorkflowItem.type.value]: () => import('./core/submission/workflowitem-data.service').then(m => m.WorkflowItemDataService),
  [VOCABULARY.value]: () => import('./core/submission/vocabularies/vocabulary.data.service').then(m => m.VocabularyDataService),
  [VOCABULARY_ENTRY_DETAIL.value]: () => import('./core/submission/vocabularies/vocabulary-entry-details.data.service').then(m => m.VocabularyEntryDetailsDataService),
  [SUBMISSION_CC_LICENSE_URL.value]: () => import('./core/submission/submission-cc-license-url-data.service').then(m => m.SubmissionCcLicenseUrlDataService),
  [SUBMISSION_CC_LICENSE.value]: () => import('./core/submission/submission-cc-license-data.service').then(m => m.SubmissionCcLicenseDataService),
  [USAGE_REPORT.value]: () => import('./core/statistics/usage-report-data.service').then(m => m.UsageReportDataService),
  [RESOURCE_POLICY.value]: () => import('./core/resource-policy/resource-policy-data.service').then(m => m.ResourcePolicyDataService),
  [RESEARCHER_PROFILE.value]: () => import('./core/profile/researcher-profile-data.service').then(m => m.ResearcherProfileDataService),
  [ORCID_QUEUE.value]: () => import('./core/orcid/orcid-queue-data.service').then(m => m.OrcidQueueDataService),
  [ORCID_HISTORY.value]: () => import('./core/orcid/orcid-history-data.service').then(m => m.OrcidHistoryDataService),
  [FEEDBACK.value]: () => import('./core/feedback/feedback-data.service').then(m => m.FeedbackDataService),
  [GROUP.value]: () => import('./core/eperson/group-data.service').then(m => m.GroupDataService),
  [EPERSON.value]: () => import('./core/eperson/eperson-data.service').then(m => m.EPersonDataService),
  [WORKFLOW_ACTION.value]: () => import('./core/data/workflow-action-data.service').then(m => m.WorkflowActionDataService),
  [VERSION_HISTORY.value]: () => import('./core/data/version-history-data.service').then(m => m.VersionHistoryDataService),
  [SITE.value]: () => import('./core/data/site-data.service').then(m => m.SiteDataService),
  [ROOT.value]: () => import('./core/data/root-data.service').then(m => m.RootDataService),
  [RELATIONSHIP_TYPE.value]: () => import('./core/data/relationship-type-data.service').then(m => m.RelationshipTypeDataService),
  [RELATIONSHIP.value]: () => import('./core/data/relationship-data.service').then(m => m.RelationshipDataService),
  [SCRIPT.value]: () => import('./core/data/processes/script-data.service').then(m => m.ScriptDataService),
  [PROCESS.value]: () => import('./core/data/processes/process-data.service').then(m => m.ProcessDataService),
  [METADATA_FIELD.value]: () => import('./core/data/metadata-field-data.service').then(m => m.MetadataFieldDataService),
  [ITEM.value]: () => import('./core/data/item-data.service').then(m => m.ItemDataService),
  [VERSION.value]: () => import('./core/data/version-data.service').then(m => m.VersionDataService),
  [IDENTIFIERS.value]: () => import('./core/data/identifier-data.service').then(m => m.IdentifierDataService),
  [FEATURE.value]: () => import('./core/data/feature-authorization/authorization-data.service').then(m => m.AuthorizationDataService),
  [DSPACE_OBJECT.value]: () => import('./core/data/dspace-object-data.service').then(m => m.DSpaceObjectDataService),
  [BITSTREAM_FORMAT.value]: () => import('./core/data/bitstream-format-data.service').then(m => m.BitstreamFormatDataService),
  [SUBMISSION_FORMS_TYPE.value]: () => import('./core/config/submission-forms-config-data.service').then(m => m.SubmissionFormsConfigDataService),
};


