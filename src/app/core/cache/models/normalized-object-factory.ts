import { NormalizedItemType } from './items/normalized-item-type.model';
import { NormalizedRelationshipType } from './items/normalized-relationship-type.model';
import { NormalizedRelationship } from './items/normalized-relationship.model';
import { NormalizedBitstream } from './normalized-bitstream.model';
import { NormalizedBundle } from './normalized-bundle.model';
import { NormalizedItem } from './normalized-item.model';
import { NormalizedCollection } from './normalized-collection.model';
import { GenericConstructor } from '../../shared/generic-constructor';
import { NormalizedCommunity } from './normalized-community.model';
import { ResourceType } from '../../shared/resource-type';
import { NormalizedObject } from './normalized-object.model';
import { NormalizedLicense } from './normalized-license.model';
import { NormalizedResourcePolicy } from './normalized-resource-policy.model';
import { NormalizedWorkspaceItem } from '../../submission/models/normalized-workspaceitem.model';
import { NormalizedEPerson } from '../../eperson/models/normalized-eperson.model';
import { NormalizedGroup } from '../../eperson/models/normalized-group.model';
import { NormalizedWorkflowItem } from '../../submission/models/normalized-workflowitem.model';
import { NormalizedClaimedTask } from '../../tasks/models/normalized-claimed-task-object.model';
import { NormalizedPoolTask } from '../../tasks/models/normalized-pool-task-object.model';
import { NormalizedBitstreamFormat } from './normalized-bitstream-format.model';
import { NormalizedMetadataSchema } from '../../metadata/normalized-metadata-schema.model';
import { CacheableObject } from '../object-cache.reducer';
import { NormalizedSubmissionDefinitionsModel } from '../../config/models/normalized-config-submission-definitions.model';
import { NormalizedSubmissionFormsModel } from '../../config/models/normalized-config-submission-forms.model';
import { NormalizedSubmissionSectionModel } from '../../config/models/normalized-config-submission-section.model';

export class NormalizedObjectFactory {
  public static getConstructor(type: ResourceType): GenericConstructor<NormalizedObject<CacheableObject>> {
    switch (type) {
      case ResourceType.Bitstream: {
        return NormalizedBitstream
      }
      case ResourceType.Bundle: {
        return NormalizedBundle
      }
      case ResourceType.Item: {
        return NormalizedItem
      }
      case ResourceType.Collection: {
        return NormalizedCollection
      }
      case ResourceType.Community: {
        return NormalizedCommunity
      }
      case ResourceType.BitstreamFormat: {
        return NormalizedBitstreamFormat
      }
      case ResourceType.License: {
        return NormalizedLicense
      }
      case ResourceType.ResourcePolicy: {
        return NormalizedResourcePolicy
      }
      case ResourceType.Relationship: {
        return NormalizedRelationship
      }
      case ResourceType.RelationshipType: {
        return NormalizedRelationshipType
      }
      case ResourceType.ItemType: {
        return NormalizedItemType
      }
      case ResourceType.EPerson: {
        return NormalizedEPerson
      }
      case ResourceType.Group: {
        return NormalizedGroup
      }
      case ResourceType.MetadataSchema: {
        return NormalizedMetadataSchema
      }
      case ResourceType.MetadataField: {
        return NormalizedGroup
      }
      case ResourceType.Workspaceitem: {
        return NormalizedWorkspaceItem
      }
      case ResourceType.Workflowitem: {
        return NormalizedWorkflowItem
      }
      case ResourceType.ClaimedTask: {
        return NormalizedClaimedTask
      }
      case ResourceType.PoolTask: {
        return NormalizedPoolTask
      }
      case ResourceType.SubmissionDefinition:
      case ResourceType.SubmissionDefinitions: {
        return NormalizedSubmissionDefinitionsModel
      }
      case ResourceType.SubmissionForm:
      case ResourceType.SubmissionForms: {
        return NormalizedSubmissionFormsModel
      }
      case ResourceType.SubmissionSection:
      case ResourceType.SubmissionSections: {
        return NormalizedSubmissionSectionModel
      }
      default: {
        return undefined;
      }
    }
  }
}
